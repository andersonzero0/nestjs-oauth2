import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostEntity } from './entity/posts.entity';
import { UserEntity } from '../users/entity/users.entity';

@Module({
  imports: [MikroOrmModule.forFeature([PostEntity, UserEntity])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
