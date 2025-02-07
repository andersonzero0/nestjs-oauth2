import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { jwtConstants } from './constants';
import { UsersModule } from '../modules/users/users.module';
import { PermissionsGuard } from './guards/permissions.guard';
import { GrantCodesModule } from '../modules/grant-codes/grant-codes.module';
import { ApplicationsModule } from '../modules/applications/applications.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '1d',
        algorithm: 'HS256',
        audience: 'http://localhost:3000',
        issuer: 'http://localhost:3000',
        subject: 'auth',
      },
      verifyOptions: {
        algorithms: ['HS256'],
        audience: 'http://localhost:3000',
        issuer: 'http://localhost:3000',
        subject: 'auth',
      },
    }),
    UsersModule,
    ApplicationsModule,
    GrantCodesModule,
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
