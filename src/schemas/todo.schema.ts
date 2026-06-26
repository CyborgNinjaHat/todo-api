import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1),
  completed: z.boolean().optional(),
});

export const updateTodoSchema = z
  .object({
    title: z.string().min(1).optional(),
    completed: z.boolean().optional(),
  })
  .refine((todo) => Object.keys(todo).length > 0, {
    message: 'At least one field must be provided',
  });

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
