import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ApplicationsEntity } from './entity/applications.entity';
import { UserEntity } from '../users/entity/users.entity';

@Module({
  imports: [MikroOrmModule.forFeature([ApplicationsEntity, UserEntity])],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
