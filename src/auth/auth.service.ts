import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/auth.interfaces';
import { Request } from 'express';
import { PostsPermissions } from '../modules/posts/permissions/post.permissions.enum';
import { GrantCodesService } from '../modules/grant-codes/grant-codes.service';
import {
  AuthorizeInputDTO,
  RequestAccessTokenInputDTO,
} from './dto/auth.input.dto';
import { ApplicationsService } from '../modules/applications/applications.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private applicationsService: ApplicationsService,
    private grantCodesService: GrantCodesService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Unauthorized');
    }

    const payload: IJwtPayload = {
      id: user.id,
      permissions: [PostsPermissions.Mutate],
      applicationId: null,
    };

    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  async authorize(user: IJwtPayload, data: AuthorizeInputDTO) {
    if (user.applicationId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const grantCode = await this.grantCodesService.createGrantCode(
      user.id,
      data.client_id,
      data.scope,
    );

    let callback_url = data.redirect_uri;

    if (!data.redirect_uri) {
      const { callbackUrl } = await this.applicationsService.findByClientId(
        data.client_id,
      );

      callback_url = callbackUrl;
    }

    return { code: grantCode, callback_url };
  }

  async requestAccessToken(data: RequestAccessTokenInputDTO) {
    const { client_id, client_secret, code } = data;

    const client_id_decoded = this.jwtService.verify(client_secret);

    if (client_id_decoded.client_id !== client_id) {
      throw new UnauthorizedException('Unauthorized');
    }

    const grantCode = await this.grantCodesService.findGrantCode(
      code,
      client_id,
    );

    if (!grantCode.activated) {
      throw new UnauthorizedException('Unauthorized');
    }

    console.log(grantCode.scope);

    const payload: IJwtPayload = {
      id: grantCode.user.id,
      permissions: [grantCode.scope],
      applicationId: grantCode.application.id,
    };

    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
