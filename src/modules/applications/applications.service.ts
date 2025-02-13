import { ForbiddenException, Injectable } from '@nestjs/common';
import { ApplicationsRepository } from './repository/applications.repository';
import { CreateApplicationInputDTO } from './dto/applications.input.dto';
import { ApplicationsEntity } from './entity/applications.entity';
import { UserRepository } from '../users/repository/users.repository';
import { EntityManager } from '@mikro-orm/sqlite';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly applicationsRepository: ApplicationsRepository,
    private readonly usersRepository: UserRepository,
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  async createApplication(
    data: CreateApplicationInputDTO,
    userId: string,
  ): Promise<Omit<ApplicationsEntity, 'id' | 'clientId'>> {
    const applicationExists = await this.applicationsRepository.findOne({
      name: data.name,
      user: userId,
    });

    if (applicationExists) {
      throw new ForbiddenException('Application already exists');
    }

    const user = await this.usersRepository.findOneOrFail(userId, {
      populate: ['applications'],
    });

    const application = this.applicationsRepository.create({
      ...data,
      clientId: await this.generateClientId(),
    });
    user.applications.add(application);
    await this.em.persistAndFlush(application);

    delete application.user;
    delete application.id;
    delete application.clientId;

    return application;
  }

  async createCredentials(applicationId: string, userId: string) {
    const application = await this.applicationsRepository.findOneOrFail({
      id: applicationId,
      user: userId,
    });

    const accessToken = await this.generateAccessToken(application.clientId);

    return {
      clientId: application.clientId,
      accessToken,
    };
  }

  async findAllApplications(
    userId: string,
  ): Promise<Omit<ApplicationsEntity, 'clientId'>[]> {
    return this.applicationsRepository.findAll({
      exclude: ['clientId'],
      where: { user: userId },
    });
  }

  async findOneApplication(
    id: string,
    userId: string,
  ): Promise<ApplicationsEntity> {
    return this.applicationsRepository.findOneOrFail({ id, user: userId });
  }

  async findByClientId(clientId: string): Promise<ApplicationsEntity> {
    return this.applicationsRepository.findOneOrFail({ clientId });
  }

  async updateApplication(
    id: string,
    data: CreateApplicationInputDTO,
    userId: string,
  ): Promise<ApplicationsEntity> {
    const application = await this.applicationsRepository.findOneOrFail({
      id,
      user: userId,
    });
    application.name = data.name;
    application.website = data.website;
    application.callbackUrl = data.callbackUrl;
    await this.em.persistAndFlush(application);

    return application;
  }

  async deleteApplication(
    id: string,
    userId: string,
  ): Promise<ApplicationsEntity> {
    const application = await this.applicationsRepository.findOneOrFail({
      id,
      user: userId,
    });

    await this.em.removeAndFlush(application);

    return application;
  }

  async generateClientId(): Promise<string> {
    const salt = await bcrypt.genSalt();

    return await bcrypt.hash(new Date().toISOString(), salt);
  }

  async generateAccessToken(clientId: string): Promise<string> {
    return await this.jwtService.signAsync({
      client_id: clientId,
    });
  }
}
