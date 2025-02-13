import { Injectable } from '@nestjs/common';
import { PostsRepository } from './repository/posts.repository';
import { EntityManager } from '@mikro-orm/sqlite';
import { CreatePostInputDTO } from './dto/posts.input.dto';
import { UserRepository } from '../users/repository/users.repository';
import { PostEntity } from './entity/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UserRepository,
    private readonly em: EntityManager,
  ) {}

  async createPost(
    data: CreatePostInputDTO,
    authorId: string,
  ): Promise<PostEntity> {
    const user = await this.usersRepository.findOneOrFail(authorId, {
      populate: ['posts'],
    });
    const post = this.postsRepository.create(data);
    user.posts.add(post);
    await this.em.persistAndFlush(post);

    delete post.author;

    return post;
  }

  async findAllPosts(authorId: string): Promise<Omit<PostEntity, 'author'>[]> {
    return this.postsRepository.findAll({
      where: { author: authorId },
      exclude: ['author'],
    });
  }

  async findOnePost(id: string, authorId: string): Promise<PostEntity> {
    return this.postsRepository.findOneOrFail({ id, author: authorId });
  }

  async updatePost(
    id: string,
    data: CreatePostInputDTO,
    authorId: string,
  ): Promise<PostEntity> {
    const post = await this.postsRepository.findOneOrFail({
      id,
      author: authorId,
    });
    post.title = data.title;
    post.content = data.content;
    await this.em.persistAndFlush(post);

    return post;
  }

  async deletePost(id: string, authorId: string): Promise<PostEntity> {
    const post = await this.postsRepository.findOneOrFail({
      id,
      author: authorId,
    });

    await this.em.removeAndFlush(post);

    return post;
  }
}
