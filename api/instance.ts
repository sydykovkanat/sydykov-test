import axios from 'axios';

import { APP_CONFIG } from '@/constants';

export const api = axios.create({
	baseURL: APP_CONFIG.apiUrl,
});

export const instance = axios.create({
	baseURL: APP_CONFIG.apiUrl,
});
