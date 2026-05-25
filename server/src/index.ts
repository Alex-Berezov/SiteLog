import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './lib/prisma';
import workTypeRoutes from './routes/workTypes';
import workLogRoutes from './routes/workLogs';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/work-types', workTypeRoutes);
app.use('/api/work-logs', workLogRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.info('Database connected successfully');
    console.info(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
});

export default app;
