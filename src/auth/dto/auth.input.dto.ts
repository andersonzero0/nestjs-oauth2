import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { PostsPermissions } from '../../modules/posts/permissions/post.permissions.enum';

export class LoginInputDTO {
  @ApiProperty({ default: 'teste' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ default: 'teste' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export enum ResponseType {
  Code = 'code',
}

export class AuthorizeInputDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsUrl()
  @IsOptional()
  redirect_uri?: string;

  @ApiProperty({ enum: ResponseType })
  @IsEnum(ResponseType)
  response_type: ResponseType;

  @ApiProperty({ enum: PostsPermissions })
  @IsEnum(PostsPermissions)
  @IsNotEmpty()
  scope: PostsPermissions;
}
