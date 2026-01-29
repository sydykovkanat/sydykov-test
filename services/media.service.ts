import { instance } from '@/api';
import { Media } from '@/types';

export class MediaService {
	public async getMedias(): Promise<Media[]> {
		const { data: medias } = await instance<Media[]>({
			method: 'GET',
			url: '/media',
		});

		return medias;
	}

	public async uploadMedia(file: File): Promise<Media> {
		const formData = new FormData();
		formData.append('file', file);

		const { data: media } = await instance<Media>({
			method: 'POST',
			url: '/media',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return media;
	}

	public async getMediaById(id: string): Promise<Blob> {
		const { data: media } = await instance<Blob>({
			method: 'GET',
			url: `/media/${id}`,
			responseType: 'blob',
		});

		return media;
	}

	public async deleteMedia(id: string): Promise<void> {
		await instance({
			method: 'DELETE',
			url: `/media/${id}`,
		});
	}

	public async downloadMedia(id: string, filename: string): Promise<void> {
		const blob = await this.getMediaById(id);
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}
}

export const mediaService = new MediaService();
