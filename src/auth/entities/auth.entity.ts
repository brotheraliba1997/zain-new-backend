import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Auth {
  id: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'client1@abc.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'Test@123',
  })
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long and include at least one letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({
    description: 'Otp you received',
    example: '123456',
  })
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    description: 'Token you received',
  })
  @IsNotEmpty()
  token: string;
}
