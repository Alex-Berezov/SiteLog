# План реализации — Журнал работ

## Стек и обоснование

| Слой | Технология | Почему |
|------|-----------|--------|
| Фронтенд | React 19 + TypeScript, Vite | Требование ТЗ. Vite — быстрый dev-сервер, нет лишней конфигурации |
| UI-компоненты | Ant Design | Готовая таблица с сортировкой/фильтрацией, формы с валидацией — всё из коробки. Для внутреннего инструмента это оптимальный выбор |
| Стейт | React Query (TanStack Query) | Кеширование, инвалидация, retry — не нужно писать руками. Для CRUD-приложения Redux — оверкилл |
| Бэкенд | Node.js + Express + TypeScript | Один язык на весь проект. Express — минимум магии, всё прозрачно |
| Валидация | zod | Одна схема — и на валидацию запросов, и на типы TypeScript |
| ORM | Prisma | Типобезопасные запросы, автогенерация типов, удобные миграции |
| БД | PostgreSQL 16 | Надёжная, бесплатная, отлично работает со структурированными данными |
| Контейнеризация | Docker Compose | Один `docker-compose up` — и всё работает |
| CI | GitHub Actions | Бесплатно для публичных репо, нативная интеграция с GitHub |
| Линтинг | ESLint + Prettier | Единый код-стайл, ловит ошибки до рантайма |
| Тесты | Vitest (фронт), Jest + Supertest (бэк) | Vitest нативно работает с Vite; Jest — стандарт для Node.js |

### Архитектура

Классическая трёхслойка: **React SPA → REST API → PostgreSQL**.

Бэкенд разбит на слои:
- **Routes** — маршруты, парсинг параметров
- **Controllers** — обработка запроса/ответа, вызов сервиса
- **Services** — бизнес-логика
- **Prisma Client** — доступ к данным

Без лишних абстракций. Для CRUD-приложения этого достаточно — код читаемый, тестируемый, расширяемый.

Монорепо с двумя папками: `client/` и `server/`. Общий `docker-compose.yml` в корне.

> **📌 Правило:** после завершения каждой фазы — коммит и пуш в репозиторий.
> Формат коммита: `phase N: краткое описание`

---

## Фаза 1. Инфраструктура и настройка проекта

- [x] **1.1 Инициализация структуры репозитория** ✅
  - [x] Создать корневую структуру: `client/`, `server/`, `docs/`, `docker/`
  - [x] Корневой `.gitignore`
  - [x] Корневой `package.json` (workspaces не нужны — проекты независимые)
- [x] **1.2 Настройка бэкенда** ✅
  - [x] `npm init` в `server/`
  - [x] Установить зависимости: express, prisma, zod, cors, dotenv
  - [x] Установить dev-зависимости: typescript, ts-node-dev, @types/*, eslint, prettier
  - [x] `tsconfig.json` — strict mode
  - [x] `.eslintrc.json`, `.prettierrc`
  - [x] Точка входа `src/index.ts` с базовым Express-сервером
  - [x] Скрипты: `dev`, `build`, `start`, `lint`
- [x] **1.3 Настройка фронтенда** ✅
  - [x] `npm create vite@latest` с шаблоном react-ts
  - [x] Установить Ant Design, TanStack Query, axios
  - [x] Установить dev-зависимости: eslint, prettier
  - [x] Базовый `App.tsx` с проверкой работоспособности
  - [x] Настроить proxy на бэкенд в `vite.config.ts`
- [x] **1.4 Docker Compose** ✅
  - [x] `Dockerfile` для сервера (multi-stage: build + runtime)
  - [x] `Dockerfile` для клиента (multi-stage: build + nginx)
  - [x] `docker-compose.yml`: postgres + server + client
  - [x] `.env.example` с переменными окружения
  - [x] `docker/nginx.conf` для клиента (проксирование /api на сервер)
- [x] **1.5 CI — GitHub Actions** ✅
  - [x] `.github/workflows/ci.yml`
  - [x] Job: lint (ESLint на client + server)
  - [x] Job: test (запуск тестов client + server, PostgreSQL как service container)
  - [x] Job: docker-build (сборка Docker-образов, без push)
  - [x] Триггер: push в main + pull requests

---

## Фаза 2. База данных и модели

- [x] **2.1 Prisma-схема и миграции** ✅
  - [x] `npx prisma init` в `server/`
  - [x] Описать модели:
    - `WorkType` — id, name (справочник видов работ)
    - `WorkLog` — id, date, workTypeId (FK → WorkType), volume, unit, workerName, createdAt, updatedAt
  - [x] Создать миграцию: `npx prisma migrate dev`
  - [x] Настроить `prisma/seed.ts` — предзаполнить `WorkType` данными
- [x] **2.2 Prisma Client и подключение** ✅
  - [x] Создать `src/lib/prisma.ts` — синглтон Prisma Client
  - [x] Проверить подключение при старте сервера

---

## Фаза 3. Бэкенд — API

- [x] **3.1 Справочник видов работ** ✅
  - [x] `GET /api/work-types` — список всех видов работ
  - [x] Роут → контроллер → сервис
  - [x] Обработка ошибок
- [x] **3.2 CRUD для журнала работ** ✅
  - [x] Zod-схемы валидации для create/update
  - [x] `GET /api/work-logs` — список записей с фильтрацией и сортировкой
  - [x] `POST /api/work-logs` — создание записи
  - [x] `PUT /api/work-logs/:id` — обновление записи
  - [x] `DELETE /api/work-logs/:id` — удаление записи
  - [x] Middleware для валидации запросов через zod
  - [x] Централизованный error handler
- [x] **3.3 Тесты бэкенда** ✅
  - [x] Настроить Jest + Supertest
  - [x] Интеграционные тесты на каждый эндпоинт (CRUD)
  - [x] Тестовая БД через переменную окружения
  - [x] npm-скрипт `test`

---

## Фаза 4. Фронтенд — основной функционал

- [ ] **4.1 Структура и базовые компоненты**
- [x] **4.1 Каркас и навигация** ✅
  - [x] `App.tsx`: Layout (Sidebar + Header + Content) на Ant Design
  - [x] Роутинг (пока одна страница — Журнал работ)
- [x] **4.2 Страница: Журнал работ (WorkLogs)** ✅
  - [x] Таблица (`antd/Table`) со списком работ
  - [x] Сортировка по дате
  - [x] Фильтрация (RangePicker для дат)
- [x] **4.3 Модалка добавления/редактирования записи** ✅
  - [x] Форма (`antd/Form`) с валидацией
  - [x] Селект для выбора вида работ (справочник)
- [x] **4.4 Интеграция с API (React Query)** ✅
  - [x] Настройка Axios-клиента с обработкой ошибок
  - [x] Хуки: `useWorkLogs`, `useCreateWorkLog`, `useUpdateWorkLog`, `useDeleteWorkLog`

---

## Фаза 5. Финализация

- [ ] **5.1 Тесты фронтенда**
  - [ ] Настроить Vitest + React Testing Library
  - [ ] Тесты на рендер таблицы
  - [ ] Тесты на валидацию формы
  - [ ] npm-скрипт `test`
- [ ] **5.2 Docker — финальная проверка**
  - [ ] Убедиться, что `docker-compose up` запускает всё с нуля
  - [ ] Prisma миграции при старте контейнера сервера
  - [ ] Сидинг при первом запуске
  - [ ] Healthcheck для PostgreSQL
- [ ] **5.3 README.md**
  - [ ] Краткое описание проекта
  - [ ] Стек и обоснование выбора (2-3 предложения)
  - [ ] Инструкция по запуску: `docker-compose up` + что открыть в браузере
  - [ ] Инструкция по локальной разработке (без Docker)
  - [ ] Структура проекта (дерево папок)
- [ ] **5.4 Код-ревью и финальный линтинг**
  - [ ] `npm run lint` — в обоих проектах
  - [ ] Убрать TODO, console.log, лишние комментарии
  - [ ] Проверить, что всё собирается без ошибок
