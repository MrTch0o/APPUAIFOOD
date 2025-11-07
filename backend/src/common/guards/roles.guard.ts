import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

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
interface RequestWithUser {
  user: UserPayload;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    // Tipando explicitamente o request como RequestWithUser
    const { user } = context.switchToHttp().getRequest<RequestWithUser>();
    return requiredRoles.some((role) => user.role === role);
  }
}
