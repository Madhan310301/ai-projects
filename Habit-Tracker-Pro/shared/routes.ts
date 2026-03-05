import { z } from 'zod';
import { insertHabitSchema, insertTodoSchema, habits, todos, habitLogs } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  habits: {
    list: {
      method: 'GET' as const,
      path: '/api/habits',
      responses: {
        200: z.array(z.custom<typeof habits.$inferSelect & { logs: typeof habitLogs.$inferSelect[], streak: number }>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/habits',
      input: insertHabitSchema,
      responses: {
        201: z.custom<typeof habits.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/habits/:id',
      input: insertHabitSchema.partial(),
      responses: {
        200: z.custom<typeof habits.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/habits/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    log: {
      method: 'POST' as const,
      path: '/api/habits/:id/log',
      input: z.object({ date: z.string() }), // YYYY-MM-DD
      responses: {
        201: z.custom<typeof habitLogs.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    unlog: {
      method: 'DELETE' as const,
      path: '/api/habits/:id/log/:date',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    }
  },
  todos: {
    list: {
      method: 'GET' as const,
      path: '/api/todos',
      responses: {
        200: z.array(z.custom<typeof todos.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/todos',
      input: insertTodoSchema,
      responses: {
        201: z.custom<typeof todos.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/todos/:id',
      input: insertTodoSchema.partial(),
      responses: {
        200: z.custom<typeof todos.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/todos/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  stats: {
    get: {
      method: 'GET' as const,
      path: '/api/stats',
      responses: {
        200: z.object({
          totalHabits: z.number(),
          completedToday: z.number(),
          completionRate: z.number(),
          streak: z.number(),
          weeklyData: z.array(z.object({
            date: z.string(),
            count: z.number(),
          })),
        }),
        401: errorSchemas.unauthorized,
      },
    },
  },
  ai: {
    analyze: {
      method: 'POST' as const,
      path: '/api/ai/analyze',
      responses: {
        200: z.object({
          insight: z.string(),
          suggestion: z.string(),
        }),
        401: errorSchemas.unauthorized,
      },
    }
  }
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
