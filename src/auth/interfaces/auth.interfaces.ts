import { PostsPermissions } from '../../modules/posts/permissions/post.permissions.enum';

export interface IJwtPayload {
  id: string;
  permissions: PostsPermissions[];
  applicationId: string | null;
}
