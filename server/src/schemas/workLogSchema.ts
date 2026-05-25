import { z } from 'zod';

export const createWorkLogSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Некорректная дата',
  }),
  workTypeId: z.string().min(1, 'Вид работ обязателен'),
  volume: z.number().positive('Объём должен быть положительным числом'),
  unit: z.string().min(1, 'Единица измерения обязательна'),
  workerName: z.string().min(1, 'ФИО исполнителя обязательно'),
});

export const updateWorkLogSchema = createWorkLogSchema.partial();

export const workLogQuerySchema = z.object({
  dateFrom: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Некорректная дата dateFrom' })
    .optional(),
  dateTo: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Некорректная дата dateTo' })
    .optional(),
  sortBy: z.enum(['date', 'createdAt']).optional().default('date'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateWorkLogInput = z.infer<typeof createWorkLogSchema>;
export type UpdateWorkLogInput = z.infer<typeof updateWorkLogSchema>;
export type WorkLogQuery = z.infer<typeof workLogQuerySchema>;
