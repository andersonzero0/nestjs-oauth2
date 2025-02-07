import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';
import { UserEntity } from '../../users/entity/users.entity';
import { ApplicationsRepository } from '../repository/applications.repository';
import { GrantCodesEntity } from '../../grant-codes/entity/grant-codes.entity';

@Entity({
  repository: () => ApplicationsRepository,
})
export class ApplicationsEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv7();

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Property({ type: 'text', unique: true })
  name: string;

  @Property({ type: 'text' })
  website: string;

  @Property({ type: 'text', fieldName: 'client_id', unique: true })
  clientId: string;

  @Property({ type: 'text', fieldName: 'callback_url' })
  callbackUrl: string;

  @Property({
    type: 'datetime',
    fieldName: 'created_at',
    onCreate: () => new Date().toISOString(),
    onUpdate: () => new Date().toISOString(),
  })
  createdAt: string;

  @Property({
    type: 'datetime',
    fieldName: 'updated_at',
    onCreate: () => new Date().toISOString(),
    onUpdate: () => new Date().toISOString(),
  })
  updatedAt: string;

  @OneToMany(() => GrantCodesEntity, (grantCode) => grantCode.application, {
    hidden: true,
  })
  grantCodes = new Collection<GrantCodesEntity>(this);
}
