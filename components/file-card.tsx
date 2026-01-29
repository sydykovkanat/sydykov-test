'use client';

import {
	IconDownload,
	IconFile,
	IconFileTypeDoc,
	IconFileTypePdf,
	IconFileTypeXls,
	IconFileTypeZip,
	IconMusic,
	IconPhoto,
	IconPlayerPlay,
	IconTrash,
	IconVideo,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteMedia, useDownloadMedia, useMedia } from '@/hooks';
import { formatDate, formatFileSize, getFileIcon } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Media } from '@/types';

interface Props {
	media: Media;
	onPreview: (media: Media) => void;
}

const iconMap = {
	image: IconPhoto,
	video: IconVideo,
	audio: IconMusic,
	pdf: IconFileTypePdf,
	doc: IconFileTypeDoc,
	sheet: IconFileTypeXls,
	archive: IconFileTypeZip,
	file: IconFile,
};

const colorMap = {
	image: 'bg-blue-500/15 text-blue-600',
	video: 'bg-purple-500/15 text-purple-600',
	audio: 'bg-pink-500/15 text-pink-600',
	pdf: 'bg-red-500/15 text-red-600',
	doc: 'bg-sky-500/15 text-sky-600',
	sheet: 'bg-emerald-500/15 text-emerald-600',
	archive: 'bg-amber-500/15 text-amber-600',
	file: 'bg-muted text-muted-foreground',
};

export function FileCard({ media, onPreview }: Props) {
	const queryClient = useQueryClient();
	const { deleteMedia, isDeleteMediaPending } = useDeleteMedia();
	const { downloadMedia } = useDownloadMedia();

	const isImage = media.mimeType.startsWith('image/');
	const isVideo = media.mimeType.startsWith('video/');
	const hasPreview = isImage || isVideo;

	// Загружаем превью только для изображений и видео
	const { mediaBlob } = useMedia(hasPreview ? media.id : '');

	const previewUrl = useMemo(() => {
		if (!mediaBlob || !hasPreview) return null;
		return URL.createObjectURL(mediaBlob);
	}, [mediaBlob, hasPreview]);

	const fileType = getFileIcon(media.mimeType);
	const Icon = iconMap[fileType as keyof typeof iconMap] || IconFile;
	const iconColor =
		colorMap[fileType as keyof typeof colorMap] || colorMap.file;

	const canPreview =
		media.mimeType.startsWith('image/') ||
		media.mimeType.startsWith('video/') ||
		media.mimeType.startsWith('audio/');

	const handleDelete = async (e: React.MouseEvent) => {
		e.stopPropagation();
		try {
			await deleteMedia(media.id);
			queryClient.invalidateQueries({ queryKey: ['medias'] });
			toast.success('Удалено');
		} catch {
			toast.error('Ошибка удаления');
		}
	};

	const handleDownload = (e: React.MouseEvent) => {
		e.stopPropagation();
		downloadMedia(media.id, media.filename);
	};

	return (
		<div
			className={cn(
				'bg-card active:bg-muted/50 flex items-center gap-3 rounded-xl p-3 transition-colors',
				canPreview && 'cursor-pointer',
			)}
			onClick={() => canPreview && onPreview(media)}
		>
			{/* Preview / Icon */}
			{previewUrl ? (
				<div className='relative size-12 shrink-0 overflow-hidden rounded-xl'>
					{isImage ? (
						<img
							src={previewUrl}
							alt={media.filename}
							className='size-full object-cover'
						/>
					) : (
						<>
							<video
								src={previewUrl}
								className='size-full object-cover'
								muted
								preload='metadata'
							/>
							<div className='absolute inset-0 flex items-center justify-center bg-black/30'>
								<IconPlayerPlay className='size-5 text-white' />
							</div>
						</>
					)}
				</div>
			) : (
				<div
					className={cn(
						'flex size-12 shrink-0 items-center justify-center rounded-xl',
						iconColor,
					)}
				>
					<Icon className='size-6' />
				</div>
			)}

			{/* Info */}
			<div className='min-w-0 flex-1'>
				<p className='truncate text-sm font-medium'>{media.filename}</p>
				<p className='text-muted-foreground text-xs'>
					{formatFileSize(media.size)} • {formatDate(media.createdAt)}
				</p>
			</div>

			{/* Actions */}
			<div className='flex shrink-0 items-center gap-1'>
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

export function FileCardSkeleton() {
	return (
		<div className='flex items-center gap-3 p-3'>
			<Skeleton className='size-12 shrink-0 rounded-xl' />
			<div className='flex-1'>
				<Skeleton className='mb-2 h-4 w-3/4' />
				<Skeleton className='h-3 w-1/2' />
			</div>
		</div>
	);
}
