# Миграция бэкенда на NestJS

Замена Express на NestJS — отличная идея для масштабируемых корпоративных приложений. Так как мы уже грамотно разделили код (фронтенд и бэкенд независимы, а база данных работает через Prisma), миграция займет немного времени и вообще не затронет клиентскую часть.

## Валидация
Мы продолжаем использовать **Zod** для валидации. Для интеграции Zod с NestJS мы будем использовать пакет `nestjs-zod` или собственный `ZodValidationPipe`, что позволит нам переиспользовать уже написанные Zod-схемы без перехода на `class-validator`.

## Предлагаемые изменения

Мы не будем удалять папку `server` целиком, чтобы сохранить настройки Docker, Prisma и CI. Мы обновим зависимости и перепишем папку `src/`.

### 1. Обновление зависимостей (`server/package.json`)
#### [MODIFY] package.json
Удаляем:
- `express`, `@types/express`
Добавляем:
- `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`, `reflect-metadata`, `rxjs`
- `nestjs-zod`
- Заменяем скрипты на использование `@nestjs/cli` для удобства.

### 2. Структура NestJS (`server/src/`)
Полностью перепишем архитектуру на модульную систему NestJS:

#### [NEW] src/main.ts
Точка входа (bootstrap). Подключение глобального `ValidationPipe` (или `ZodValidationPipe`), настройка CORS, глобального префикса `api`.

#### [NEW] src/app.module.ts
Корневой модуль, объединяющий все остальные модули.

#### [NEW] src/prisma/*
- `prisma.module.ts` и `prisma.service.ts`: обертка над PrismaClient для использования через DI (Dependency Injection).

#### [NEW] src/work-types/*
- `work-types.module.ts`
- `work-types.controller.ts` (GET `/api/work-types`)
- `work-types.service.ts`

#### [NEW] src/work-logs/*
- `work-logs.module.ts`
- `work-logs.controller.ts` (CRUD для `/api/work-logs`)
- `work-logs.service.ts`
- `dto/create-work-log.dto.ts` (на основе существующих Zod-схем)
- `dto/update-work-log.dto.ts`
- `dto/query-work-log.dto.ts`

#### [DELETE] Старые файлы Express
Удалим старые папки `controllers`, `services`, `middleware`, `routes`, `index.ts`.

### 3. Инфраструктура и Тесты
#### [MODIFY] server/tsconfig.json
Включим `experimentalDecorators` и `emitDecoratorMetadata` (обязательно для NestJS).
#### [MODIFY] server/src/__tests__/workLogs.test.ts
Перепишем E2E тесты с использованием `@nestjs/testing` (стандартный подход для Nest).
#### [MODIFY] server/Dockerfile
Обновим сборку под структуру NestJS (например, используем `nest build`).

## План проверки

### Автоматические тесты
- Запуск обновленных E2E тестов: `yarn --cwd server test`
- Линтер: `yarn --cwd server lint`

### Ручная проверка
- Поднять проект через `docker-compose up --build`
- Проверить, что фронтенд успешно получает данные и сохраняет записи (так как API контракты не изменятся, фронт даже не заметит подмены).
