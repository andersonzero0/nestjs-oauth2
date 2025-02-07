import { EntityRepository } from '@mikro-orm/sqlite';
import { GrantCodesEntity } from '../entity/grant-codes.entity';

export class GrantCodesRepository extends EntityRepository<GrantCodesEntity> {}
