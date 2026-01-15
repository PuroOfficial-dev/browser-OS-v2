import { z } from 'zod';
import { insertSettingsSchema, settings, customApps, insertCustomAppSchema, users, insertUserSchema } from './schema';

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.object({
          user: z.custom<typeof users.$inferSelect>(),
          message: z.string(),
        }),
        401: z.object({ message: z.string() }),
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/auth/register',
      input: insertUserSchema,
      responses: {
        201: z.object({
          user: z.custom<typeof users.$inferSelect>(),
          message: z.string(),
        }),
        400: z.object({ message: z.string() }),
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
  },
  settings: {
    get: {
      method: 'GET' as const,
      path: '/api/settings',
      responses: {
        200: z.custom<typeof settings.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/settings',
      input: insertSettingsSchema.partial(),
      responses: {
        200: z.custom<typeof settings.$inferSelect>(),
      },
    },
  },
  apps: {
    list: {
      method: 'GET' as const,
      path: '/api/apps',
      responses: {
        200: z.array(z.custom<typeof customApps.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/apps',
      input: insertCustomAppSchema,
      responses: {
        201: z.custom<typeof customApps.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/apps/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  upload: {
    method: 'POST' as const,
    path: '/api/upload',
    responses: {
      200: z.object({ url: z.string() }),
    },
  }
};

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
