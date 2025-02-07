import { UserEntity } from '../entity/users.entity';

export class UsersOutputDTO {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.username = user.username;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
