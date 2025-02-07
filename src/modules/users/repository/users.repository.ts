import { EntityRepository } from '@mikro-orm/sqlite';
import { UserEntity } from '../entity/users.entity';

export class UserRepository extends EntityRepository<UserEntity> {}
