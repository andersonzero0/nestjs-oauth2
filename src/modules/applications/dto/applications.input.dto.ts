import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateApplicationInputDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, format: 'url' })
  @IsUrl()
  @IsNotEmpty()
  website: string;

  @ApiProperty({ type: String })
  @IsUrl({
    require_protocol: true,
    protocols: ['https', 'http'],
    require_valid_protocol: true,
    require_host: true,
    require_tld: false,
  })
  @IsNotEmpty()
  callbackUrl: string;
}
