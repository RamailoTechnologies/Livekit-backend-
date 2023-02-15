import { ApiProperty } from '@nestjs/swagger';

export class canPublishPremissionDto {
  @ApiProperty({ type: 'string', example: 'nepal' })
  roomId: string;
  @ApiProperty({ type: 'string', example: 'token' })
  identity: string;
  @ApiProperty({ type: 'boolean', example: false })
  publish: boolean;
}
