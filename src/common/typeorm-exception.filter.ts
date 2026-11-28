import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface PostgresError extends Error {
  code?: string;
  detail?: string;
}

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const error = exception.driverError as PostgresError;
    const postgresErrors: Record<string, { status: number; message: string }> =
      {
        '23505': {
          status: HttpStatus.CONFLICT,
          message: 'Ya existe un registro con esos datos',
        },
        '23503': {
          status: HttpStatus.BAD_REQUEST,
          message: 'La referencia a un registro no existe',
        },
      };
    const translated = postgresErrors[error.code ?? ''];

    response
      .status(translated?.status ?? HttpStatus.INTERNAL_SERVER_ERROR)
      .json({
        statusCode: translated?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
        message: translated?.message ?? 'Error en la base de datos',
        ...(error.detail ? { detalle: error.detail } : {}),
      });
  }
}
