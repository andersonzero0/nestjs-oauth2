import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PostsPermissions } from '../../modules/posts/permissions/post.permissions.enum';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RequestType } from '../../infra/http/http.interfaces';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PostsPermissions[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredPermissions) {
      return true;
    }

    console.log(requiredPermissions);

    const { user }: RequestType = context.switchToHttp().getRequest();

    console.log(user.permissions);

    return requiredPermissions.some((requiredPermissions) =>
      user.permissions?.includes(requiredPermissions),
    );
  }
}
