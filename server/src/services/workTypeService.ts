import prisma from '../lib/prisma';

export const workTypeService = {
  async getAll() {
    return prisma.workType.findMany({
      orderBy: { name: 'asc' },
    });
  },
};
