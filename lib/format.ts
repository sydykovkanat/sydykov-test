export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Б';

	const k = 1024;
	const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

export function getFileIcon(mimeType: string): string {
	if (mimeType.startsWith('image/')) return 'image';
	if (mimeType.startsWith('video/')) return 'video';
	if (mimeType.startsWith('audio/')) return 'audio';
	if (mimeType.includes('pdf')) return 'pdf';
	if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
	if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'sheet';
	if (
		mimeType.includes('zip') ||
		mimeType.includes('rar') ||
		mimeType.includes('archive')
	)
		return 'archive';
	return 'file';
}
