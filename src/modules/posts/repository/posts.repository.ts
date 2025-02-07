import { EntityRepository } from '@mikro-orm/sqlite';
import { PostEntity } from '../entity/posts.entity';

export class PostsRepository extends EntityRepository<PostEntity> {}
