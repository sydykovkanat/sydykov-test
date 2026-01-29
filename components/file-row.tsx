'use client';

import {
	IconDownload,
	IconFile,
	IconFileTypeDoc,
	IconFileTypePdf,
	IconFileTypeXls,
	IconFileTypeZip,
	IconMusic,
	IconTrash,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useDeleteMedia, useDownloadMedia } from '@/hooks';
import { formatFileSize } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Media } from '@/types';

interface Props {
	media: Media;
}

const iconMap: Record<string, typeof IconFile> = {
	audio: IconMusic,
	pdf: IconFileTypePdf,
	doc: IconFileTypeDoc,
	sheet: IconFileTypeXls,
	archive: IconFileTypeZip,
	file: IconFile,
};

const colorMap: Record<string, string> = {
	audio: 'bg-pink-500/15 text-pink-600',
	pdf: 'bg-red-500/15 text-red-600',
	doc: 'bg-sky-500/15 text-sky-600',
	sheet: 'bg-emerald-500/15 text-emerald-600',
	archive: 'bg-amber-500/15 text-amber-600',
	file: 'bg-muted text-muted-foreground',
};

function getFileType(mimeType: string): string {
	if (mimeType.startsWith('audio/')) return 'audio';
	if (mimeType === 'application/pdf') return 'pdf';
	if (
		mimeType.includes('word') ||
		mimeType.includes('document') ||
		mimeType === 'text/plain'
	)
		return 'doc';
	if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'sheet';
	if (
		mimeType.includes('zip') ||
		mimeType.includes('rar') ||
		mimeType.includes('tar') ||
		mimeType.includes('compressed')
	)
		return 'archive';
	return 'file';
}

export function FileRow({ media }: Props) {
	const queryClient = useQueryClient();
	const { deleteMedia, isDeleteMediaPending } = useDeleteMedia();
	const { downloadMedia } = useDownloadMedia();

	const fileType = getFileType(media.mimeType);
	const Icon = iconMap[fileType] || IconFile;
	const iconColor = colorMap[fileType] || colorMap.file;

	const handleDelete = async () => {
		try {
			await deleteMedia(media.id);
			queryClient.invalidateQueries({ queryKey: ['medias'] });
			toast.success('Удалено');
		} catch {
			toast.error('Ошибка');
		}
	};

	const handleDownload = () => {
		downloadMedia(media.id, media.filename);
	};

	return (
		<div className='flex items-center gap-3 py-3'>
			<div
				className={cn(
					'flex size-11 shrink-0 items-center justify-center rounded-xl',
					iconColor,
				)}
			>
				<Icon className='size-5' />
			</div>

			<div className='min-w-0 flex-1'>
				<p className='truncate text-sm font-medium'>{media.filename}</p>
				<p className='text-muted-foreground text-xs'>
					{formatFileSize(media.size)}
				</p>
			</div>

			<div className='flex items-center'>
				<Button
					variant='ghost'
					size='icon-sm'
					onClick={handleDownload}
					className='text-muted-foreground'
				>
					<IconDownload className='size-5' />
				</Button>
				<Button
					variant='ghost'
					size='icon-sm'
					onClick={handleDelete}
					disabled={isDeleteMediaPending}
					className='text-muted-foreground'
				>
					<IconTrash className='size-5' />
				</Button>
			</div>
		</div>
	);
}
