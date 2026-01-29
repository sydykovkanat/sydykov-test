'use client';

import { useMemo } from 'react';

import { useMedia } from '@/hooks';
import { Media } from '@/types';

interface Props {
	media: Media;
}

export function MediaPreview({ media }: Props) {
	const { mediaBlob, isMediaLoading } = useMedia(media.id);

	const mediaUrl = useMemo(() => {
		if (!mediaBlob) return null;
		return URL.createObjectURL(mediaBlob);
	}, [mediaBlob]);

	if (isMediaLoading || !mediaUrl) return null;

	return (
		<div className='flex flex-col items-center'>
			{media.mimeType.startsWith('image/') ? (
				<img
					src={mediaUrl}
					alt={media.filename}
					className='max-h-96 w-auto rounded-lg'
				/>
			) : media.mimeType.startsWith('video/') ? (
				<video src={mediaUrl} controls className='max-h-96 w-auto rounded-lg' />
			) : media.mimeType.startsWith('audio/') ? (
				<audio src={mediaUrl} controls className='w-full'>
					Your browser does not support the audio element.
				</audio>
			) : (
				<p>Предпросмотр недоступен для этого типа медиа.</p>
			)}
			<p className='mt-2 text-center text-sm text-gray-600'>{media.filename}</p>
		</div>
	);
}
