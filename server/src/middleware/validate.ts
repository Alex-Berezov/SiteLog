import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate =
  (schema: ZodSchema, source: 'body' | 'query' = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(source === 'body' ? req.body : req.query);
      if (source === 'body') {
        req.body = data;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const zError = error as any;
        res.status(400).json({
          message: 'Ошибка валидации',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          errors: zError.errors.map((e: any) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
