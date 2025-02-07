import { Injectable } from '@nestjs/common';
import { GrantCodesRepository } from './repository/grant-codes.repository';
import { PostsPermissions } from '../posts/permissions/post.permissions.enum';
import { ApplicationsRepository } from '../applications/repository/applications.repository';
import { UserRepository } from '../users/repository/users.repository';
import { EntityManager } from '@mikro-orm/sqlite';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GrantCodesService {
  constructor(
    private readonly grantCodesRepository: GrantCodesRepository,
    private readonly applicationsRepository: ApplicationsRepository,
    private readonly usersRepository: UserRepository,
    private readonly em: EntityManager,
  ) {}

  async createGrantCode(
    userId: string,
    clientId: string,
    scope: PostsPermissions,
  ): Promise<string> {
    try {
      const grantCodeExists = await this.grantCodesRepository.findOne({
        user: userId,
        application: {
          clientId,
        },
      });

      if (grantCodeExists) {
        grantCodeExists.activated = true;
        await this.em.persistAndFlush(grantCodeExists);
        return grantCodeExists.code;
      }

      const application = await this.applicationsRepository.findOneOrFail(
        {
          clientId,
        },
        {
          populate: ['user'],
        },
      );

      if (application.user.id == userId) {
        throw new Error(
          'You cannot create a grant code for your own application',
        );
      }

      const user = await this.usersRepository.findOneOrFail(userId);

      const code = await this.generateCode();
      const expiresDays = 365;
      const expiresAt = new Date(
        Date.now() + 1000 * 60 * 60 * 24 * expiresDays,
      );

      const grantCode = this.grantCodesRepository.create({
        user,
        application,
        scope,
        code,
        activated: true,
        expiresAt: expiresAt.toISOString(),
      });

      user.grantCodes.add(grantCode);
      application.grantCodes.add(grantCode);

      await this.em.persistAndFlush(grantCode);

      return grantCode.code;
    } catch (error) {
      throw error;
    }
  }

  async generateCode() {
    return await bcrypt.hash(Date.now().toString(), 10);
  }
}
