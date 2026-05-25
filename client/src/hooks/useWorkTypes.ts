import { useQuery } from '@tanstack/react-query';
import { workTypesApi } from '../api/workTypes';

export const useWorkTypes = () => {
  return useQuery({
    queryKey: ['workTypes'],
    queryFn: workTypesApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 минут кэширования для справочника
  });
};
