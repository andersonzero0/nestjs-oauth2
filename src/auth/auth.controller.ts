import {
  Body,
  Controller,
  HttpRedirectResponse,
  Post,
  Query,
  Redirect,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthorizeInputDTO,
  LoginInputDTO,
  RequestAccessTokenInputDTO,
} from './dto/auth.input.dto';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestType } from '../infra/http/http.interfaces';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @Public()
  @Post('login')
  async login(@Body() data: LoginInputDTO) {
    try {
      return await this.authService.login(data.username, data.password);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Authorize' })
  @Redirect()
  @Post('authorize')
  async authorize(
    @Query() query: AuthorizeInputDTO,
    @Req() req: RequestType,
  ): Promise<HttpRedirectResponse> {
    try {
      const { code, callback_url } = await this.authService.authorize(
        req.user,
        query,
      );

      return {
        url: `${callback_url}?code=${code}`,
        statusCode: 302,
      };
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Request Access Token' })
  @Public()
  @Post('token')
  async token(@Body() data: RequestAccessTokenInputDTO) {
    try {
      return await this.authService.requestAccessToken(data);
    } catch (error) {
      throw error;
    }
  }
}
