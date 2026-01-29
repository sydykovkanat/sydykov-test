'use client';

import { IconPhoto, IconPlus } from '@tabler/icons-react';
import { useMemo, useRef, useState } from 'react';

import { FileRow } from '@/components/file-row';
import { FileUpload, FileUploadRef } from '@/components/file-upload';
import { GalleryItem } from '@/components/gallery-item';
import { MediaModal } from '@/components/media-modal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useMedias } from '@/hooks';
import { Media } from '@/types';

// Группировка по датам
function groupByDate(medias: Media[]) {
	const groups: Record<string, Media[]> = {};
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	medias.forEach((media) => {
		const date = new Date(media.createdAt);
		let key: string;

		if (date.toDateString() === today.toDateString()) {
			key = 'Сегодня';
		} else if (date.toDateString() === yesterday.toDateString()) {
			key = 'Вчера';
		} else {
			key = date.toLocaleDateString('ru-RU', {
				day: 'numeric',
				month: 'long',
			});
		}

		if (!groups[key]) groups[key] = [];
		groups[key].push(media);
	});

	return groups;
}

export default function Page() {
	const { medias, isMediasLoading } = useMedias();
	const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const fileUploadRef = useRef<FileUploadRef>(null);

	const openFilePicker = () => {
		fileUploadRef.current?.click();
	};

	// Разделяем на медиа (фото/видео) и файлы
	const { mediaItems, fileItems } = useMemo(() => {
		const mediaItems: Media[] = [];
		const fileItems: Media[] = [];

		medias.forEach((m) => {
			if (m.mimeType.startsWith('image/') || m.mimeType.startsWith('video/')) {
				mediaItems.push(m);
			} else {
				fileItems.push(m);
			}
		});

		return { mediaItems, fileItems };
	}, [medias]);

	const groupedMedia = useMemo(() => groupByDate(mediaItems), [mediaItems]);

	const handlePreview = (media: Media) => {
		setSelectedMedia(media);
		setIsModalOpen(true);
	};

	return (
		<div className='bg-background min-h-svh pb-24'>
			{/* Hidden file input + Upload component */}
			<FileUpload ref={fileUploadRef} />

			{isMediasLoading ? (
				<div className='p-4'>
					<div className='grid grid-cols-3 gap-1'>
						{Array.from({ length: 9 }).map((_, i) => (
							<Skeleton key={i} className='aspect-square rounded-sm' />
						))}
					</div>
				</div>
			) : medias.length === 0 ? (
				<div className='flex min-h-svh flex-col items-center justify-center px-4'>
					<div className='bg-muted mb-4 flex size-20 items-center justify-center rounded-full'>
						<IconPhoto className='text-muted-foreground size-10' />
					</div>
					<p className='text-foreground mb-1 text-lg font-medium'>Нет файлов</p>
					<p className='text-muted-foreground mb-6 text-center text-sm'>
						Загрузите фото, видео или документы
					</p>
					<Button size='lg' onClick={openFilePicker}>
						<IconPlus className='mr-2 size-5' />
						Загрузить
					</Button>
				</div>
			) : (
				<>
					{/* Галерея фото/видео */}
					{mediaItems.length > 0 && (
						<section>
							{Object.entries(groupedMedia).map(([date, items]) => (
								<div key={date}>
									<div className='bg-background/80 sticky top-0 z-10 px-4 py-2 backdrop-blur-sm'>
										<p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
											{date}
										</p>
									</div>
									<div className='grid grid-cols-3 gap-0.5 px-0.5'>
										{items.map((media) => (
											<GalleryItem
												key={media.id}
												media={media}
												onPreview={handlePreview}
											/>
										))}
									</div>
								</div>
							))}
						</section>
					)}

					{/* Файлы (документы, архивы и т.д.) */}
					{fileItems.length > 0 && (
						<section className='mt-4'>
							<div className='bg-background/80 sticky top-0 z-10 px-4 py-2 backdrop-blur-sm'>
								<p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
									Файлы
								</p>
							</div>
							<div className='px-4'>
								{fileItems.map((media) => (
									<FileRow key={media.id} media={media} />
								))}
							</div>
						</section>
					)}
				</>
			)}

			{/* FAB */}
			{medias.length > 0 && (
				<Button
					onClick={openFilePicker}
					className='fixed right-4 bottom-6 z-50 size-14 rounded-full shadow-xl'
					size='icon'
				>
					<IconPlus className='size-7' />
				</Button>
			)}

			<MediaModal
				media={selectedMedia}
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div>
	);
}
