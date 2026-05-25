import { createZodDto } from 'nestjs-zod';
import {
  createWorkLogSchema,
  updateWorkLogSchema,
  workLogQuerySchema,
} from '../../schemas/workLogSchema';

export class CreateWorkLogDto extends createZodDto(createWorkLogSchema) {}
export class UpdateWorkLogDto extends createZodDto(updateWorkLogSchema) {}
export class WorkLogQueryDto extends createZodDto(workLogQuerySchema) {}
