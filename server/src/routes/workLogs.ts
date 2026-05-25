import { Router } from 'express';
import { workLogController } from '../controllers/workLogController';
import { validate } from '../middleware/validate';
import {
  createWorkLogSchema,
  updateWorkLogSchema,
  workLogQuerySchema,
} from '../schemas/workLogSchema';

const router = Router();

router.get('/', validate(workLogQuerySchema, 'query'), workLogController.getAll);
router.get('/:id', workLogController.getById);
router.post('/', validate(createWorkLogSchema), workLogController.create);
router.put('/:id', validate(updateWorkLogSchema), workLogController.update);
router.delete('/:id', workLogController.delete);

export default router;
