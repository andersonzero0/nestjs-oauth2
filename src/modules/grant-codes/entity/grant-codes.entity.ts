import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';
import { UserEntity } from '../../users/entity/users.entity';
import { ApplicationsEntity } from '../../applications/entity/applications.entity';
import { GrantCodesRepository } from '../repository/grant-codes.repository';
import { PostsPermissions } from '../../posts/permissions/post.permissions.enum';

@Entity({
  repository: () => GrantCodesRepository,
})
export class GrantCodesEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv7();

  @Property()
  code: string;

  @Property({ type: 'boolean' })
  activated: boolean;

  @Property({ type: 'enum' })
  scope: PostsPermissions;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => ApplicationsEntity)
  application: ApplicationsEntity;

  @Property({ type: 'datetime', fieldName: 'expires_at' })
  expiresAt: string;

  @Property({
    type: 'datetime',
    fieldName: 'created_at',
    onCreate: () => new Date().toISOString(),
  })
  createdAt: string;

  @Property({
    type: 'datetime',
    fieldName: 'updated_at',
    onCreate: () => new Date().toISOString(),
    onUpdate: () => new Date().toISOString(),
  })
  updatedAt: string;
}
