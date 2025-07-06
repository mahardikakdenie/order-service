import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Response } from 'express';

export const TransformerResponse = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse<Response>();

    return {
      success: <T>(payload: T, statusText?: string, meta?: Response) => {
        return response.status(response.statusCode).json({
          meta: !meta
            ? {
                status: true,
                code: response.statusCode,
                message: statusText || 'Success',
              }
            : meta,
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
