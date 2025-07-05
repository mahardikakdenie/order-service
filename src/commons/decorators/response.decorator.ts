import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Response } from 'express';

export const TransformerResponse = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse<Response>();

    return {
      success: <T>(payload: T, statusText?: string) => {
        return response.status(response.statusCode).json({
          meta: {
            status: true,
            code: response.statusCode,
            message: statusText || 'Success',
          },
          data: payload,
        });
      },
      error: (message: string, code: number) => {
        return response.status(code).json({
          meta: {
            status: false,
            code,
            message,
          },
        });
      },
    };
  },
);
