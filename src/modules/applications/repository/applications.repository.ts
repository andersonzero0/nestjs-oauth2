import { EntityRepository } from '@mikro-orm/sqlite';
import { ApplicationsEntity } from '../entity/applications.entity';

export class ApplicationsRepository extends EntityRepository<ApplicationsEntity> {}
