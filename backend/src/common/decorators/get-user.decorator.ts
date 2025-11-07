import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '@prisma/client';

// Interface que define a estrutura do usuário no request
interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  is2FAEnabled: boolean;
}

// Interface que estende o Request do Express adicionando a propriedade user
interface RequestWithUser extends Request {
  user: UserPayload;
}

export const GetUser = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    // Tipando explicitamente o request como RequestWithUser
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // Se data for fornecido, retorna a propriedade específica, senão retorna o user completo

    return data ? user[data] : user;
  },
);
