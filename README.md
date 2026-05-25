# SiteLog (Журнал производства работ)

SiteLog — это веб-приложение для ведения журнала выполненных работ на строительном объекте. Оно позволяет фиксировать объёмы, виды работ, даты и исполнителей с возможностью сортировки и фильтрации.

## 🛠 Стек технологий

**Frontend (Клиент)**
- React 19 + TypeScript
- Vite (сборщик)
- Ant Design (UI-библиотека)
- TanStack Query (React Query) для работы с API
- Axios для сетевых запросов
- Day.js для работы с датами

**Backend (Сервер)**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL (база данных)
- Zod (валидация данных)
- Jest + Supertest (интеграционное тестирование)

**Инфраструктура**
- Docker & Docker Compose (многоконтейнерная сборка)
- GitHub Actions (CI для линтинга, тестов и сборки Docker образов)

---

## 🚀 Запуск приложения (Docker)

Это самый простой способ запуска. Потребуется только установленный [Docker](https://docs.docker.com/get-docker/) и `docker-compose`.

1. Склонируйте репозиторий:
   ```bash
   git clone https://github.com/Alex-Berezov/SiteLog.git
   cd SiteLog
   ```

2. Запустите все контейнеры (БД, Backend, Frontend):
   ```bash
   docker-compose up --build -d
   ```

4. Откройте приложение в браузере:
   - Frontend: [http://localhost:8080](http://localhost:8080)
   - Backend API: [http://localhost:3000/api/work-logs](http://localhost:3000/api/work-logs)

💡 *Docker-контейнер бэкенда при запуске автоматически применяет миграции и заполняет базу данных начальными видами работ (seed).*

4. Для остановки выполните:
   ```bash
   docker-compose down
   ```

---

## 💻 Локальный запуск (для разработки)

Если вы хотите разрабатывать проект, вам потребуется Node.js v20+, Yarn v1.22+ и локальный PostgreSQL (или запущенный через Docker).

### 1. Подготовка базы данных
Вы можете запустить только БД через Docker:
```bash
docker-compose up postgres -d
```
Убедитесь, что строка подключения в `server/.env` корректна (для локального запуска мы стучимся в `localhost`, а не в `postgres`):
```env
DATABASE_URL="postgresql://sitelog:sitelog@localhost:5432/sitelog"
```

### 2. Запуск Backend (Сервера)
```bash
cd server
yarn install
yarn prisma migrate dev # применение миграций и сидинг видов работ
yarn dev
```
Сервер запустится на [http://localhost:3000](http://localhost:3000).

### 3. Запуск Frontend (Клиента)
В новом окне терминала:
```bash
cd client
yarn install
yarn dev
```
Клиент запустится на [http://localhost:5173](http://localhost:5173) (стандартный порт Vite). Запросы к API автоматически проксируются на бэкенд (`localhost:3000`) благодаря настройкам Vite.

---

## 📚 Документация API

Базовый URL: `/api`

### Справочники
* **GET** `/work-types` — Получить все доступные виды работ.

### Журнал работ
* **GET** `/work-logs` — Получить список записей.
  * *Query параметры:* `dateFrom`, `dateTo` (в формате ISO), `sortBy` (date | createdAt), `order` (asc | desc).
* **GET** `/work-logs/:id` — Получить конкретную запись по ID.
* **POST** `/work-logs` — Создать новую запись.
  * *Тело:* `{ "date": "ISOString", "workTypeId": "uuid", "volume": 12.5, "unit": "м³", "workerName": "Иванов И.И." }`
* **PUT** `/work-logs/:id` — Обновить запись.
* **DELETE** `/work-logs/:id` — Удалить запись.
