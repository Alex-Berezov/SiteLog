import axios from 'axios';
import { message } from 'antd';

// Базовый URL использует прокси, настроенный в vite.config.ts
export const apiClient = axios.create({
  baseURL: '/api',
});

// Глобальный перехватчик ответов для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg = error.response?.data?.message || 'Произошла ошибка при обращении к серверу';
    message.error(errorMsg);
    return Promise.reject(error);
  },
);
