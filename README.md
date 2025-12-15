# Cafe App - Telegram Bot Café Management

Полнофункциональное приложение для управления кафе с Telegram-ботом.

## Архитектура

- **Backend**: Node.js + Express + TypeScript + Prisma (PostgreSQL)
- **Frontend**: React + Vite + TypeScript
- **Database**: PostgreSQL 16
- **Containerization**: Docker & Docker Compose

## Быстрый старт (локально с Docker)

### Требования
- Docker 20.10+
- Docker Compose 2.0+

### Инструкция

1. **Клонировать репозиторий**
```bash
git clone <repository-url>
cd cafe-app
```

2. **Создать `.env` файл** (или скопировать из `.env.example`)
```bash
cp .env.example .env
```

3. **Поднять контейнеры**
```bash
docker compose up --build
```

Это запустит:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **Database**: localhost:5432 (postgres/postgres)

4. **Остановить контейнеры**
```bash
docker compose down
```

## Команды

### Локальная разработка (без Docker)

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### С Docker Compose

```bash
# Собрать и запустить
docker compose up --build

# Запустить в фоне
docker compose up -d

# Посмотреть логи
docker compose logs -f

# Остановить
docker compose down

# Удалить всё (включая БД)
docker compose down -v
```

### Запуск конкретного сервиса

```bash
# Только backend
docker compose -f backend/docker-compose.yml up --build

# Только frontend
docker compose up frontend

# Только БД
docker compose up db
```

## Переменные окружения

Скопируйте `.env.example` в `.env` и заполните значения:

```env
# Database (для локальной разработки можно использовать значения ниже)
DB_USER=postgres
DB_PASSWORD=<ваш_пароль>
DB_NAME=cafe_dev

# Backend
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:<ваш_пароль>@db:5432/cafe_dev
TELEGRAM_BOT_TOKEN=<ваш_токен_от_BotFather>

# Frontend
VITE_API_URL=http://localhost:3000
```

⚠️ **Важно:** 
- `.env` файл **не коммитится** в git (защита от утечки секретов)
- `TELEGRAM_BOT_TOKEN` никогда не добавляйте в репо
- На сервере используйте переменные окружения контейнера, а не файл `.env`

## Структура проекта

```
cafe-app/
├── backend/                  # Node.js Express сервер
│   ├── src/
│   ├── prisma/              # Миграции БД и схема
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
├── frontend/                # React + Vite приложение
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # Главный файл для всех сервисов
├── .env.example
└── .gitignore
```

## Деплой на сервер

### Вариант 1: Простой деплой (прямой запуск на сервере)

```bash
# На сервере в папке с проектом
docker compose pull
docker compose up -d

# Проверить статус
docker compose ps

# Просмотреть логи
docker compose logs -f backend
```

### Вариант 2: С CI/CD (GitHub Actions)

Изображения собираются в GitHub Actions и пушятся в реестр (например, GHCR).
Затем на сервере:

```bash
docker login ghcr.io  # если нужно
docker compose pull
docker compose up -d
```

## Решение проблем

### БД не подключается
```bash
# Проверить статус БД
docker compose exec db psql -U postgres -d cafe_dev

# Пересоздать БД
docker compose down -v
docker compose up db
```

### Frontend не подключается к Backend
- Убедитесь, что в `.env` правильно `VITE_API_URL`
- Проверьте, что backend запущен: `docker compose logs backend`

### Чистка Docker кэша
```bash
docker compose down -v
docker system prune -a
docker compose up --build
```

## Contributing

[Добавьте рекомендации по контрибьютингу]

## License

[Добавьте лицензию]
