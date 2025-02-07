import {
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { PostEntity } from '../../posts/entity/posts.entity';
import { UserRepository } from '../repository/users.repository';
import { v7 as uuidv7 } from 'uuid';
import { ApplicationsEntity } from '../../applications/entity/applications.entity';
import { GrantCodesEntity } from '../../grant-codes/entity/grant-codes.entity';

@Entity({ repository: () => UserRepository })
export class UserEntity {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv7();

  @Property({ type: 'text', unique: true })
  username!: string;

  @Property({ type: 'text' })
  password!: string;

  @OneToMany(() => PostEntity, (post) => post.author, { hidden: true })
  posts = new Collection<PostEntity>(this);

  @OneToMany(() => ApplicationsEntity, (application) => application.user, {
    hidden: true,
  })
  applications = new Collection<ApplicationsEntity>(this);

  @OneToMany(() => GrantCodesEntity, (grantCode) => grantCode.user, {
    hidden: true,
  })
  grantCodes = new Collection<GrantCodesEntity>(this);

  @Property({ type: 'datetime', onCreate: () => new Date().toISOString() })
  createdAt: string;

  @Property({
    type: 'datetime',
    onCreate: () => new Date().toISOString(),
    onUpdate: () => new Date().toISOString(),
  })
  updatedAt: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
