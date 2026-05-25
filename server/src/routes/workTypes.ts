import { Router } from 'express';
import { workTypeController } from '../controllers/workTypeController';

const router = Router();

router.get('/', workTypeController.getAll);

export default router;
