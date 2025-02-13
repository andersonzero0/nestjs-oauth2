import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInputDTO } from './dto/users.input.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Public()
  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  async create(@Body() data: CreateUserInputDTO) {
    return this.userService.create(data);
  }

  @Public()
  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
