import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UserSession {
  id: string;

  @ApiProperty({
    description: 'FCM Token',
  })
  @IsNotEmpty()
  @IsString()
  fcmToken: string;

  @ApiProperty({
    description: 'User Id',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
