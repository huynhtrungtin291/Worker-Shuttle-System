import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { UserActor } from '../../common/enums/actor.enum';
import { UserRequest } from '../../common/types/request-context.type';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserActor[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request: UserRequest = context.switchToHttp().getRequest();
    // const request: RefreshRequest = context.switchToHttp().getRequest();
    const user = request['user'];

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Chỉ admin mới được tạo tài khoản');
    }

    return true;
  }
}
