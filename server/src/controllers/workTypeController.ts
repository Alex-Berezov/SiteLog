import { Request, Response, NextFunction } from 'express';
import { workTypeService } from '../services/workTypeService';

export const workTypeController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const workTypes = await workTypeService.getAll();
      res.json(workTypes);
    } catch (error) {
      next(error);
    }
  },
};
