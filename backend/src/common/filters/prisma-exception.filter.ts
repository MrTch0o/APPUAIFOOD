import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Filter para capturar e tratar erros do Prisma de forma amigável
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';

    // P2002: Unique constraint violation
    if (exception.code === 'P2002') {
      status = HttpStatus.CONFLICT;
      const fields = (exception.meta?.target as string[]) || [];
      const fieldName = fields[0] || 'campo';
      message = `${this.getFieldNameInPortuguese(fieldName)} já está em uso`;
    }

    // P2003: Foreign key constraint violation
    else if (exception.code === 'P2003') {
      status = HttpStatus.BAD_REQUEST;
      message =
        'Referência inválida. Verifique se os dados relacionados existem';
    }

    // P2025: Record not found
    else if (exception.code === 'P2025') {
      status = HttpStatus.NOT_FOUND;
      message = 'Registro não encontrado';
    }

    // P2014: Relation violation
    else if (exception.code === 'P2014') {
      status = HttpStatus.BAD_REQUEST;
      message =
        'Não é possível realizar esta operação devido a relações existentes';
    }

    // P2016: Query interpretation error
    else if (exception.code === 'P2016') {
      status = HttpStatus.BAD_REQUEST;
      message = 'Erro na consulta. Verifique os dados enviados';
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: this.getErrorName(status),
      timestamp: new Date().toISOString(),
      path: request.url,
      code: exception.code,
    });
  }

  /**
   * Traduz nomes de campos para português
   */
  private getFieldNameInPortuguese(field: string): string {
    const translations: Record<string, string> = {
      email: 'Email',
      phone: 'Telefone',
      name: 'Nome',
      cpf: 'CPF',
      cnpj: 'CNPJ',
    };

    return translations[field] || field;
  }

  /**
   * Retorna o nome do erro baseado no status
   */
  private getErrorName(status: number): string {
    const errorNames: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'Bad Request',
      [HttpStatus.CONFLICT]: 'Conflict',
      [HttpStatus.NOT_FOUND]: 'Not Found',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
    };

    return errorNames[status] || 'Error';
  }
}
