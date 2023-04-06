import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    // authentication
    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    // authorization
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user) throw new InternalServerErrorException('User not found');

    for (const role of user.roles) {
      if (validRoles.includes(role.name)) return true;
    }

    throw new ForbiddenException(
      `User '${user.name}' does not have sufficient permissions to access this resource`,
    );
  }
}
