import { Module } from '@nestjs/common';
import { GrantCodesService } from './grant-codes.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { GrantCodesEntity } from './entity/grant-codes.entity';
import { ApplicationsEntity } from '../applications/entity/applications.entity';
import { UserEntity } from '../users/entity/users.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      GrantCodesEntity,
      ApplicationsEntity,
      UserEntity,
    ]),
  ],
  providers: [GrantCodesService],
  exports: [GrantCodesService],
})
export class GrantCodesModule {}
