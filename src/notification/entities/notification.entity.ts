import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export enum NotificationTypeEnum {
  MESSAGE = 'MESSAGE',
  REGISTRATION = 'REGISTRATION',
  SUBSCRIPTION = 'SUBSCRIPTION',
  MEETING = 'MEETING',
  ALERT = 'ALERT',
  CUSTOM = 'CUSTOM',
}

export class Notification {
  id: string;

  @ApiProperty({
    description: 'Name of the program',
    example: 'ABC Health Insurance',
  })
  @IsNotEmpty()
  @IsEnum(NotificationTypeEnum)
  type: NotificationTypeEnum;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  data: string;

  @IsNotEmpty()
  @IsString()
  createdAt: string;

  @IsNotEmpty()
  @IsString()
  recipients: string[];
}
