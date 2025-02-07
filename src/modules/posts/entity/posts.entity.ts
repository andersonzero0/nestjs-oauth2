import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { UserEntity } from '../../users/entity/users.entity';
import { PostsRepository } from '../repository/posts.repository';
import { v7 as uuidv7 } from 'uuid';

@Entity({ repository: () => PostsRepository })
export class PostEntity {
  @Property({ type: 'uuid', primary: true, unique: true })
  id: string = uuidv7();

  @Property({ type: 'text' })
  title!: string;

  @Property({ type: 'text' })
  content!: string;

  @ManyToOne(() => UserEntity)
  author!: UserEntity;

  @Property({ type: 'datetime', onCreate: () => new Date().toISOString() })
  createdAt: string;

  @Property({
    type: 'datetime',
    onCreate: () => new Date().toISOString(),
    onUpdate: () => new Date().toISOString(),
  })
  updatedAt: string;

  constructor(title: string, content: string, author: UserEntity) {
    this.title = title;
    this.content = content;
    this.author = author;
  }
}
