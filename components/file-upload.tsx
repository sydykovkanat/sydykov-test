'use client';

import {
	IconAlertTriangle,
	IconCheck,
	IconFile,
	IconMusic,
	IconPhoto,
	IconVideo,
	IconX,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUploadMedia } from '@/hooks';
import { formatFileSize } from '@/lib/format';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface UploadingFile {
	file: File;
	progress: number;
	status: 'pending' | 'uploading' | 'done' | 'error';
	error?: string;
}

function getFileIcon(type: string) {
	if (type.startsWith('image/')) return IconPhoto;
	if (type.startsWith('video/')) return IconVideo;
	if (type.startsWith('audio/')) return IconMusic;
	return IconFile;
}

export interface FileUploadRef {
	click: () => void;
}

export const FileUpload = forwardRef<FileUploadRef>(
	function FileUpload(_, ref) {
		const queryClient = useQueryClient();
		const { uploadMedia } = useUploadMedia();
		const [files, setFiles] = useState<UploadingFile[]>([]);
		const [isUploading, setIsUploading] = useState(false);
		const inputRef = useRef<HTMLInputElement>(null);

		useImperativeHandle(ref, () => ({
			click: () => inputRef.current?.click(),
		}));

		const validateFile = (file: File): string | null => {
			if (file.size > MAX_FILE_SIZE) {
				return `Макс. ${formatFileSize(MAX_FILE_SIZE)}`;
			}
			return null;
		};

		const addFiles = useCallback((newFiles: File[]) => {
			const uploadingFiles: UploadingFile[] = newFiles.map((file) => {
				const error = validateFile(file);
				return {
					file,
					progress: 0,
					status: error ? 'error' : 'pending',
					error: error ?? undefined,
				};
			});

			setFiles((prev) => [...prev, ...uploadingFiles]);
		}, []);

		const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.files) {
				addFiles(Array.from(e.target.files));
				e.target.value = '';
			}
		};

		const removeFile = (index: number) => {
			setFiles((prev) => prev.filter((_, i) => i !== index));
		};

		const handleUpload = async () => {
			const validFiles = files.filter((f) => f.status === 'pending');
			if (validFiles.length === 0) return;

			setIsUploading(true);
			let successCount = 0;

			for (let i = 0; i < files.length; i++) {
				const fileItem = files[i];
				if (fileItem.status !== 'pending') continue;

				setFiles((prev) =>
					prev.map((f, idx) =>
						idx === i ? { ...f, status: 'uploading', progress: 50 } : f,
					),
				);

				try {
					await uploadMedia(fileItem.file);
					setFiles((prev) =>
						prev.map((f, idx) =>
							idx === i ? { ...f, status: 'done', progress: 100 } : f,
						),
					);
					successCount++;
				} catch (error) {
					const errorMessage =
						error instanceof Error ? error.message : 'Ошибка';
					setFiles((prev) =>
						prev.map((f, idx) =>
							idx === i
								? { ...f, status: 'error', error: errorMessage, progress: 0 }
								: f,
						),
					);
				}
			}

			setIsUploading(false);
			queryClient.invalidateQueries({ queryKey: ['medias'] });

			if (successCount > 0) {
				toast.success(`Загружено: ${successCount}`);
				setFiles([]);
			}
		};

		const pendingCount = files.filter((f) => f.status === 'pending').length;
		const hasFiles = files.length > 0;

		return (
			<>
				{/* Hidden input */}
				<input
					ref={inputRef}
					type='file'
					multiple
					onChange={handleFileSelect}
					className='hidden'
				/>

				{/* Upload queue - shows at bottom when files selected */}
				{hasFiles && (
					<div className='bg-background/95 border-border fixed inset-x-0 bottom-0 z-50 border-t p-4 backdrop-blur-sm'>
						<div className='mx-auto max-w-lg space-y-3'>
							{/* File List */}
							<div className='max-h-48 space-y-2 overflow-y-auto'>
								{files.map((item, index) => {
									const FileIcon = getFileIcon(item.file.type);
									return (
										<div
											key={`${item.file.name}-${index}`}
											className='bg-muted/50 flex items-center gap-3 rounded-xl p-3'
										>
											<div
												className={cn(
													'flex size-10 shrink-0 items-center justify-center rounded-lg',
													item.status === 'error'
														? 'bg-destructive/10 text-destructive'
														: item.status === 'done'
															? 'bg-emerald-500/10 text-emerald-600'
															: 'bg-background text-muted-foreground',
												)}
											>
												{item.status === 'done' ? (
													<IconCheck className='size-5' />
												) : item.status === 'error' ? (
													<IconAlertTriangle className='size-5' />
												) : (
													<FileIcon className='size-5' />
												)}
											</div>

											<div className='min-w-0 flex-1'>
												<p className='truncate text-sm'>{item.file.name}</p>
												<p className='text-muted-foreground text-xs'>
													{item.error || formatFileSize(item.file.size)}
												</p>
												{item.status === 'uploading' && (
													<Progress
														value={item.progress}
														className='mt-1.5 h-1'
													/>
												)}
											</div>

											{item.status !== 'uploading' &&
												item.status !== 'done' && (
													<Button
														variant='ghost'
														size='icon-sm'
														onClick={() => removeFile(index)}
													>
														<IconX className='size-4' />
													</Button>
												)}
										</div>
									);
								})}
							</div>

							{/* Upload Button */}
							{pendingCount > 0 && (
								<Button
									className='w-full'
									size='lg'
									onClick={handleUpload}
									disabled={isUploading}
								>
									{isUploading ? 'Загрузка...' : `Загрузить (${pendingCount})`}
								</Button>
							)}
						</div>
					</div>
				)}
			</>
		);
	},
);
