'use client';

import { IconPlayerPlay } from '@tabler/icons-react';
import { useMemo } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { useMedia } from '@/hooks';
import { Media } from '@/types';

interface Props {
	media: Media;
	onPreview: (media: Media) => void;
}

export function GalleryItem({ media, onPreview }: Props) {
	const isVideo = media.mimeType.startsWith('video/');
	const { mediaBlob, isMediaLoading } = useMedia(media.id);

	const previewUrl = useMemo(() => {
		if (!mediaBlob) return null;
		return URL.createObjectURL(mediaBlob);
	}, [mediaBlob]);

	if (isMediaLoading || !previewUrl) {
		return <Skeleton className='aspect-square' />;
	}

	return (
		<button
			onClick={() => onPreview(media)}
			className='relative aspect-square overflow-hidden bg-black focus:ring-2 focus:ring-white/50 focus:outline-none focus:ring-inset'
		>
			{isVideo ? (
				<>
					<video
						src={previewUrl}
						className='size-full object-cover'
						muted
						preload='metadata'
					/>
					<div className='absolute inset-0 flex items-center justify-center bg-black/20'>
						<div className='flex size-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm'>
							<IconPlayerPlay className='size-5 text-white' />
						</div>
					</div>
				</>
			) : (
				<img
					src={previewUrl}
					alt={media.filename}
					className='size-full object-cover'
				/>
			)}
		</button>
	);
}
