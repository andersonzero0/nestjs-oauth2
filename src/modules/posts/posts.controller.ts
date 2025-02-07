import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostInputDTO } from './dto/posts.input.dto';
import { RequestType } from '../../infra/http/http.interfaces';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PostsPermissions } from './permissions/post.permissions.enum';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Create a new post' })
  @Post()
  @Permissions<PostsPermissions>(PostsPermissions.Mutate)
  async create(@Body() data: CreatePostInputDTO, @Req() req: RequestType) {
    return this.postsService.createPost(data, req.user.id);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @Get()
  @Permissions<PostsPermissions>(PostsPermissions.Read, PostsPermissions.Mutate)
  async findAll(@Req() req: RequestType) {
    return this.postsService.findAllPosts(req.user.id);
  }
}
