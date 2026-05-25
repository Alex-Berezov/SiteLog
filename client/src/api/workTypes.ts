import { apiClient } from './apiClient';
import type { WorkType } from '../types';

export const workTypesApi = {
  getAll: async (): Promise<WorkType[]> => {
    const { data } = await apiClient.get<WorkType[]>('/work-types');
    return data;
  },
};
