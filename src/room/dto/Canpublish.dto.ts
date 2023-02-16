import { ApiProperty } from '@nestjs/swagger';

export class canPublishPremissionDto {
  @ApiProperty({ type: 'string', example: 'ramailo' })
  roomId: string;
  @ApiProperty({ type: 'string', example: 'sewak' })
  premissionFor: string;
  @ApiProperty({ type: 'boolean', example: false })
  publish: boolean;

  @ApiProperty({
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXRhZGF0YSI6IntcInJhaXNlZFwiOltdfSIsInZpZGVvIjp7InJvb21Kb2luIjp0cnVlLCJjYW5QdWJsaXNoIjp0cnVlLCJjYW5QdWJsaXNoRGF0YSI6dHJ1ZSwiY2FuU3Vic2NyaWJlIjp0cnVlLCJyb29tIjoic3RyaW5nIn0sImlhdCI6MTY3NjUzMDA1MCwibmJmIjoxNjc2NTMwMDUwLCJleHAiOjE2NzY1MzM2NTAsImlzcyI6ImRldmtleSIsInN1YiI6InN1cGVydmlzb3IiLCJqdGkiOiJzdXBlcnZpc29yIn0.8acTIlUAo_5pmLPQbESe_CkUsbj8Mhq0YION24REIiY',
  })
  supervisorToken: string;
}
