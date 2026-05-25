import express from 'express';
import cors from 'cors';
import workTypeRoutes from '../routes/workTypes';
import workLogRoutes from '../routes/workLogs';
import { errorHandler } from '../middleware/errorHandler';

/**
 * Создаёт Express-приложение без запуска listen().
 * Используется в тестах через supertest.
 */
export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/work-types', workTypeRoutes);
  app.use('/api/work-logs', workLogRoutes);

  app.use(errorHandler);

  return app;
}
