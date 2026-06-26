import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { Prisma } from '@prisma/client';
import { prisma } from './db.js';
import { createTodoSchema, updateTodoSchema } from './schemas/todo.schema.js';

export const app = express();

app.use(cors());
app.use(express.json());

const isRecordNotFoundError = (err: unknown) =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025';

app.get('/todos', async (_req: Request, res: Response) => {
  const todos = await prisma.todo.findMany();
  res.json(todos);
});

app.get('/todos/:id', async (req, res) => {
  const todo = await prisma.todo.findUnique({
    where: { id: req.params.id },
  });

  if (!todo) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }

  res.json(todo);
});

app.post('/todos', async (req, res) => {
  const result = createTodoSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const todo = await prisma.todo.create({
    data: result.data,
  });

  res.status(201).json(todo);
});

app.patch('/todos/:id', async (req, res, next: NextFunction) => {
  const result = updateTodoSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  try {
    const todo = await prisma.todo.update({
      where: { id: req.params.id },
      data: result.data,
    });

    res.json(todo);
  } catch (err) {
    if (isRecordNotFoundError(err)) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    next(err);
  }
});

app.delete('/todos/:id', async (req, res, next: NextFunction) => {
  try {
    await prisma.todo.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (err) {
    if (isRecordNotFoundError(err)) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    next(err);
  }
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});
