import { Request, Response, NextFunction } from 'express';
import { workLogService } from '../services/workLogService';

export const workLogController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workLogs = await workLogService.getAll(req.query as never);
      res.json(workLogs);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const workLog = await workLogService.getById(req.params.id);
      res.json(workLog);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const workLog = await workLogService.create(req.body);
      res.status(201).json(workLog);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const workLog = await workLogService.update(req.params.id, req.body);
      res.json(workLog);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await workLogService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
