import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkLogDto, UpdateWorkLogDto, WorkLogQueryDto } from './dto/work-log.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkLogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: WorkLogQueryDto) {
    const { dateFrom, dateTo, sortBy, order } = query;
    const where: Prisma.WorkLogWhereInput = {};

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    const orderBy = (sortBy ? { [sortBy]: order } : { date: 'desc' }) as Prisma.WorkLogOrderByWithRelationInput;

    return this.prisma.workLog.findMany({
      where,
      orderBy,
      include: {
        workType: true,
      },
    });
  }

  async findOne(id: string) {
    const log = await this.prisma.workLog.findUnique({
      where: { id },
      include: { workType: true },
    });
    if (!log) {
      throw new NotFoundException('Запись не найдена');
    }
    return log;
  }

  async create(data: CreateWorkLogDto) {
    return this.prisma.workLog.create({
      data: {
        date: new Date(data.date),
        volume: data.volume,
        unit: data.unit,
        workerName: data.workerName,
        workTypeId: data.workTypeId,
      },
      include: { workType: true },
    });
  }

  async update(id: string, data: UpdateWorkLogDto) {
    await this.findOne(id); // Check existence
    
    return this.prisma.workLog.update({
      where: { id },
      data: {
        date: data.date ? new Date(data.date) : undefined,
        volume: data.volume,
        unit: data.unit,
        workerName: data.workerName,
        workTypeId: data.workTypeId,
      },
      include: { workType: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check existence
    await this.prisma.workLog.delete({ where: { id } });
    return { success: true };
  }
}
