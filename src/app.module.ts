import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { PostsModule } from './modules/posts/posts.module';
import { UserEntity } from './modules/users/entity/users.entity';
import { PostEntity } from './modules/posts/entity/posts.entity';
import { AuthModule } from './auth/auth.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { ApplicationsEntity } from './modules/applications/entity/applications.entity';
import { GrantCodesModule } from './modules/grant-codes/grant-codes.module';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: [UserEntity, PostEntity, ApplicationsEntity, GrantCodesModule],
      dbName: 'db.sqlite3',
      driver: SqliteDriver,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    ApplicationsModule,
    GrantCodesModule,
  ],
})
export class AppModule {}
