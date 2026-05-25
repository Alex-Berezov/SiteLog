import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialWorkTypes = [
  'Кладка перегородок',
  'Монтаж опалубки',
  'Бетонирование',
  'Армирование',
  'Штукатурные работы',
  'Монтаж металлоконструкций',
  'Устройство гидроизоляции',
  'Кровельные работы',
  'Отделочные работы',
  'Прокладка инженерных сетей',
];

async function main() {
  console.info('Starting seed...');
  for (const name of initialWorkTypes) {
    await prisma.workType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.info('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
