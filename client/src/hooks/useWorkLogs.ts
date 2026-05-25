import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workLogsApi } from '../api/workLogs';
import type { WorkLogQuery, CreateWorkLogInput, UpdateWorkLogInput } from '../types';
import { message } from 'antd';

export const useWorkLogs = (query?: WorkLogQuery) => {
  return useQuery({
    queryKey: ['workLogs', query],
    queryFn: () => workLogsApi.getAll(query),
  });
};

export const useCreateWorkLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkLogInput) => workLogsApi.create(data),
    onSuccess: () => {
      message.success('Запись успешно добавлена');
      queryClient.invalidateQueries({ queryKey: ['workLogs'] });
    },
  });
};

export const useUpdateWorkLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string } & UpdateWorkLogInput) => workLogsApi.update(data),
    onSuccess: () => {
      message.success('Запись успешно обновлена');
      queryClient.invalidateQueries({ queryKey: ['workLogs'] });
    },
  });
};

export const useDeleteWorkLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workLogsApi.delete(id),
    onSuccess: () => {
      message.success('Запись удалена');
      queryClient.invalidateQueries({ queryKey: ['workLogs'] });
    },
  });
};
