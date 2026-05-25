import { apiClient } from './apiClient';
import { WorkType } from '../types';

export const workTypesApi = {
  getAll: async (): Promise<WorkType[]> => {
    const { data } = await apiClient.get<WorkType[]>('/work-types');
    return data;
  },
};
