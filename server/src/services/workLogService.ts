import prisma from '../lib/prisma';
import { CreateWorkLogInput, UpdateWorkLogInput, WorkLogQuery } from '../schemas/workLogSchema';
import { AppError } from '../middleware/errorHandler';

export const workLogService = {
  async getAll(query: WorkLogQuery) {
    const { dateFrom, dateTo, sortBy, order } = query;

    const where: Record<string, unknown> = {};
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) (where.date as Record<string, unknown>).gte = new Date(dateFrom);
      if (dateTo) (where.date as Record<string, unknown>).lte = new Date(dateTo);
    }

    return prisma.workLog.findMany({
      where,
      include: { workType: true },
      orderBy: { [sortBy]: order },
    });
  },

  async getById(id: string) {
    const workLog = await prisma.workLog.findUnique({
      where: { id },
      include: { workType: true },
    });

    if (!workLog) {
      throw new AppError(404, 'Запись не найдена');
    }

    return workLog;
  },

  async create(data: CreateWorkLogInput) {
    const workType = await prisma.workType.findUnique({
      where: { id: data.workTypeId },
    });

    if (!workType) {
      throw new AppError(400, 'Указанный вид работ не существует');
    }

    return prisma.workLog.create({
      data: {
        date: new Date(data.date),
        workTypeId: data.workTypeId,
        volume: data.volume,
        unit: data.unit,
        workerName: data.workerName,
      },
      include: { workType: true },
    });
  },

  async update(id: string, data: UpdateWorkLogInput) {
    await this.getById(id);

    if (data.workTypeId) {
      const workType = await prisma.workType.findUnique({
        where: { id: data.workTypeId },
      });
      if (!workType) {
        throw new AppError(400, 'Указанный вид работ не существует');
      }
    }

    return prisma.workLog.update({
      where: { id },
      data: {
        ...(data.date && { date: new Date(data.date) }),
        ...(data.workTypeId && { workTypeId: data.workTypeId }),
        ...(data.volume !== undefined && { volume: data.volume }),
        ...(data.unit && { unit: data.unit }),
        ...(data.workerName && { workerName: data.workerName }),
      },
      include: { workType: true },
    });
  },

  async delete(id: string) {
    await this.getById(id);
    return prisma.workLog.delete({ where: { id } });
  },
};
