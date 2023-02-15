import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @ApiProperty({ type: 'string', format: 'binary' })
  user: string;

  @IsString()
  @ApiProperty({ type: 'string', format: 'binary' })
  room: string;
}
