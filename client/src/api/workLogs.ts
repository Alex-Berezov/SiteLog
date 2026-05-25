import { apiClient } from './apiClient';
import { WorkLog, WorkLogQuery, CreateWorkLogInput, UpdateWorkLogInput } from '../types';

export const workLogsApi = {
  getAll: async (query?: WorkLogQuery): Promise<WorkLog[]> => {
    const { data } = await apiClient.get<WorkLog[]>('/work-logs', { params: query });
    return data;
  },

  create: async (payload: CreateWorkLogInput): Promise<WorkLog> => {
    const { data } = await apiClient.post<WorkLog>('/work-logs', payload);
    return data;
  },

  update: async ({ id, ...payload }: { id: string } & UpdateWorkLogInput): Promise<WorkLog> => {
    const { data } = await apiClient.put<WorkLog>(`/work-logs/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/work-logs/${id}`);
  },
};
