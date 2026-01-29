import { useMutation, useQuery } from '@tanstack/react-query';

import { mediaService } from '@/services';

export const useMedias = () => {
	const { data, isLoading } = useQuery({
		queryKey: ['medias'],
		queryFn: () => mediaService.getMedias(),
	});

	return {
		medias: data ?? [],
		isMediasLoading: isLoading,
	};
};

export const useMedia = (id: string) => {
	const { data, isLoading } = useQuery({
		queryKey: ['media', id],
		queryFn: () => mediaService.getMediaById(id),
		enabled: !!id,
	});

	return {
		mediaBlob: data,
		isMediaLoading: isLoading,
	};
};

export const useUploadMedia = () => {
	const { mutateAsync, isPending } = useMutation({
		mutationKey: ['upload-media'],
		mutationFn: (file: File) => mediaService.uploadMedia(file),
	});

	return {
		uploadMedia: mutateAsync,
		isUploadMediaPending: isPending,
	};
};

export const useDeleteMedia = () => {
	const { mutateAsync, isPending } = useMutation({
		mutationKey: ['delete-media'],
		mutationFn: (id: string) => mediaService.deleteMedia(id),
	});

	return {
		deleteMedia: mutateAsync,
		isDeleteMediaPending: isPending,
	};
};

export const useDownloadMedia = () => {
	const download = (id: string, filename: string) => {
		mediaService.downloadMedia(id, filename);
	};

	return { downloadMedia: download };
};
