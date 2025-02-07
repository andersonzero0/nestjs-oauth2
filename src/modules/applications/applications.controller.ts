import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationInputDTO } from './dto/applications.input.dto';
import { RequestType } from '../../infra/http/http.interfaces';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @ApiOperation({ summary: 'Create a new application' })
  @Post()
  async createApplication(
    @Body() data: CreateApplicationInputDTO,
    @Req() req: RequestType,
  ) {
    return this.applicationsService.createApplication(data, req.user.id);
  }

  @ApiOperation({ summary: 'Get all applications' })
  @Get()
  async findAll(@Req() req: RequestType) {
    return this.applicationsService.findAllApplications(req.user.id);
  }

  @ApiOperation({ summary: 'Update an application' })
  @Put(':applicationId')
  async updateApplication(
    @Param('applicationId') applicationId: string,
    @Body() data: CreateApplicationInputDTO,
    @Req() req: RequestType,
  ) {
    return this.applicationsService.updateApplication(
      applicationId,
      data,
      req.user.id,
    );
  }

  @ApiOperation({ summary: 'Create credentials for an application' })
  @Get(':applicationId/credentials')
  async createCredentials(
    @Param('applicationId') applicationId: string,
    @Req() req: RequestType,
  ) {
    return this.applicationsService.createCredentials(
      applicationId,
      req.user.id,
    );
  }
}
