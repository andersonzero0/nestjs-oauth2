import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRepository } from './repository/users.repository';
import { CreateUserInputDTO } from './dto/users.input.dto';
import { UsersOutputDTO } from './dto/users.output.dto';
import { EntityManager } from '@mikro-orm/sqlite';
import { UserEntity } from './entity/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private em: EntityManager,
  ) {}

  async create(data: CreateUserInputDTO): Promise<UsersOutputDTO> {
    const userExists = await this.userRepository.findOne({
      username: data.username,
    });

    if (userExists) {
      throw new ForbiddenException('User already exists');
    }

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = new UserEntity(data.username, hashedPassword);

    await this.em.persistAndFlush(user);

    return new UsersOutputDTO(user);
  }

  async findAll(): Promise<UsersOutputDTO[]> {
    const users = await this.userRepository.findAll();

    return users.map((user) => new UsersOutputDTO(user));
  }

  async findOne(id: string): Promise<UsersOutputDTO> {
    const user = await this.userRepository.findOne({ id });

    return new UsersOutputDTO(user);
  }

  async findByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ username });

    return user;
  }

  async update(id: string, data: CreateUserInputDTO): Promise<UsersOutputDTO> {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    user.username = data.username;
    user.password = data.password;

    await this.em.persistAndFlush(user);

    return new UsersOutputDTO(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    await this.em.removeAndFlush(user);
  }
}
