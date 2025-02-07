import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

export const Permissions = <T>(...roles: T[]) =>
  SetMetadata(PERMISSIONS_KEY, roles);
