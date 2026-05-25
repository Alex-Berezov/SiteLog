import request from 'supertest';
import prisma from '../lib/prisma';
import { createApp } from './app';

const app = createApp();

beforeAll(async () => {
  await prisma.$connect();

  // Очищаем таблицы перед тестами
  await prisma.workLog.deleteMany();
  await prisma.workType.deleteMany();

  // Создаём тестовые виды работ
  await prisma.workType.createMany({
    data: [{ name: 'Кладка перегородок' }, { name: 'Бетонирование' }],
  });
});

afterAll(async () => {
  await prisma.workLog.deleteMany();
  await prisma.workType.deleteMany();
  await prisma.$disconnect();
});

describe('GET /api/health', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/work-types', () => {
  it('should return list of work types', async () => {
    const res = await request(app).get('/api/work-types');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('name');
  });
});

describe('Work Logs CRUD', () => {
  let workTypeId: string;
  let workLogId: string;

  beforeAll(async () => {
    const workTypes = await prisma.workType.findMany();
    workTypeId = workTypes[0].id;
  });

  it('POST /api/work-logs — should create a work log', async () => {
    const res = await request(app).post('/api/work-logs').send({
      date: '2025-05-20',
      workTypeId,
      volume: 24,
      unit: 'м³',
      workerName: 'Иванов И.И.',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.volume).toBe(24);
    expect(res.body.workerName).toBe('Иванов И.И.');
    workLogId = res.body.id;
  });

  it('POST /api/work-logs — should fail validation with empty body', async () => {
    const res = await request(app).post('/api/work-logs').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('GET /api/work-logs — should return list of work logs', async () => {
    const res = await request(app).get('/api/work-logs');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('workType');
  });

  it('GET /api/work-logs — should filter by date range', async () => {
    const res = await request(app)
      .get('/api/work-logs')
      .query({ dateFrom: '2025-05-01', dateTo: '2025-05-31' });
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/work-logs/:id — should return a single work log', async () => {
    const res = await request(app).get(`/api/work-logs/${workLogId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(workLogId);
  });

  it('GET /api/work-logs/:id — should return 404 for non-existent id', async () => {
    const res = await request(app).get('/api/work-logs/nonexistent-id');
    expect(res.status).toBe(404);
  });

  it('PUT /api/work-logs/:id — should update a work log', async () => {
    const res = await request(app).put(`/api/work-logs/${workLogId}`).send({
      volume: 30,
      unit: 'м²',
    });

    expect(res.status).toBe(200);
    expect(res.body.volume).toBe(30);
    expect(res.body.unit).toBe('м²');
  });

  it('DELETE /api/work-logs/:id — should delete a work log', async () => {
    const res = await request(app).delete(`/api/work-logs/${workLogId}`);
    expect(res.status).toBe(204);
  });

  it('GET /api/work-logs/:id — should return 404 after deletion', async () => {
    const res = await request(app).get(`/api/work-logs/${workLogId}`);
    expect(res.status).toBe(404);
  });
});
