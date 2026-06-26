# Todo API

> A minimalist, type-safe REST API for managing todos.

## Tech Stack

[Express 5](https://expressjs.com/) · [TypeScript](https://www.typescriptlang.org/) · [Prisma 7](https://www.prisma.io/) (`@prisma/adapter-pg`) · [Zod](https://zod.dev/) · [PostgreSQL](https://www.postgresql.org/)

## API Endpoints

| Method   | Endpoint     | Purpose             | Success       |
| -------- | ------------ | ------------------- | ------------- |
| `GET`    | `/todos`     | Fetch all todos     | `200`         |
| `GET`    | `/todos/:id` | Fetch a single todo | `200` / `404` |
| `POST`   | `/todos`     | Create a todo       | `201`         |
| `PATCH`  | `/todos/:id` | Update a todo       | `200` / `404` |
| `DELETE` | `/todos/:id` | Delete a todo       | `204` / `404` |

`POST` requires a non-empty `title`; `completed` is optional and defaults to `false`.
`PATCH` accepts `title`, `completed`, or both, and rejects empty bodies. Invalid bodies return `400` with Zod issues.

## Data Schema

```prisma
model Todo {
  id        String   @id @default(cuid())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your PostgreSQL connection strings.

| Variable       | Used by             | Notes                        |
| -------------- | ------------------- | ---------------------------- |
| `DATABASE_URL` | App runtime         | Prisma Client connection     |
| `DIRECT_URL`   | Prisma CLI          | Migrations connection        |
| `PORT`         | Express HTTP server | Optional, defaults to `3000` |

## Getting Started

```bash
npm install
cp .env.example .env
npx prisma migrate deploy
npm run dev
```

Server starts at `http://localhost:3000` unless `PORT` is set.

## Scripts

```bash
npm run dev           # dev server with hot reload
npm run build         # prisma generate && tsc
npm start             # run dist/index.js
npm run lint          # ESLint
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier write
npm run format:check  # Prettier check
```

## License

[MIT](LICENSE) © 2026 Artem
