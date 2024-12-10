import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();

    const userId = user['userId'];

    const usersRoles = await this.authService.findUserById(userId);

    for (const role of usersRoles.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }
    throw new ForbiddenException(
      `${usersRoles.displayName} no tiene permisos para realizar esta acción`,
    );
  }
}
