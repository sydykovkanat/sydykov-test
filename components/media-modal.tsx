'use client';

import { IconDownload, IconX } from '@tabler/icons-react';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useDownloadMedia, useMedia } from '@/hooks';
import { formatFileSize } from '@/lib/format';
import { Media } from '@/types';

interface Props {
	media: Media | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function MediaModal({ media, open, onOpenChange }: Props) {
	const { mediaBlob, isMediaLoading } = useMedia(media?.id ?? '');
	const { downloadMedia } = useDownloadMedia();

	const mediaUrl = useMemo(() => {
		if (!mediaBlob) return null;
		return URL.createObjectURL(mediaBlob);
	}, [mediaBlob]);

	if (!media) return null;

	const handleDownload = () => {
		downloadMedia(media.id, media.filename);
		toast.success('Скачивание началось');
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				showCloseButton={false}
				className='flex h-dvh w-screen max-w-none flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-xl sm:border'
			>
				{/* Header */}
				<div className='bg-background border-border/30 flex items-center justify-between gap-3 border-b px-4 py-3'>
					<div className='min-w-0 flex-1'>
						<p className='truncate text-sm font-medium'>{media.filename}</p>
						<p className='text-muted-foreground text-xs'>
							{formatFileSize(media.size)}
						</p>
					</div>
					<div className='flex items-center gap-1'>
						<Button
							variant='ghost'
							size='icon'
							onClick={handleDownload}
							className='size-10'
						>
							<IconDownload className='size-5' />
						</Button>
						<DialogClose asChild>
							<Button variant='ghost' size='icon' className='size-10'>
								<IconX className='size-5' />
							</Button>
						</DialogClose>
					</div>
				</div>

				{/* Content */}
				<div className='bg-muted/50 flex flex-1 items-center justify-center overflow-auto'>
					{isMediaLoading || !mediaUrl ? (
						<div className='flex flex-col items-center gap-3'>
							<Skeleton className='size-12 rounded-lg' />
							<Skeleton className='h-3 w-24' />
						</div>
					) : media.mimeType.startsWith('image/') ? (
						<img
							src={mediaUrl}
							alt={media.filename}
							className='max-h-full max-w-full object-contain'
						/>
					) : media.mimeType.startsWith('video/') ? (
						<video
							src={mediaUrl}
							controls
							playsInline
							className='max-h-full max-w-full'
						/>
					) : media.mimeType.startsWith('audio/') ? (
						<div className='w-full max-w-sm px-6'>
							<audio src={mediaUrl} controls className='w-full'>
								Your browser does not support the audio element.
							</audio>
						</div>
					) : (
						<div className='p-6 text-center'>
							<p className='text-muted-foreground text-sm'>
								Предпросмотр недоступен
							</p>
							<Button className='mt-4' onClick={handleDownload}>
								<IconDownload className='mr-2 size-4' />
								Скачать
							</Button>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
