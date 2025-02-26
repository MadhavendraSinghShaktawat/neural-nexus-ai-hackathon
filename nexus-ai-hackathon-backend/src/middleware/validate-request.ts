import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          message: 'Validation failed',
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: 'Internal server error'
        });
      }
    }
  };
}; 