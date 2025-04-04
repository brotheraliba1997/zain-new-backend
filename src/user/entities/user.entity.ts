// import {
//   IsEmail,
//   IsEnum,
//   IsNotEmpty,
//   IsString,
//   Matches,
// } from 'class-validator';

// import { ApiProperty } from '@nestjs/swagger';

// export enum UserRole {
//   SUPER_ADMIN = 'super_admin',
//   ADMIN = 'admin',
//   DOCTOR = 'doctor',
//   CLIENT = 'client',
// }

// export class User {
//   id: string;

//   @ApiProperty({
//     description: 'First name of the user',
//     example: 'Client',
//   })
//   @IsNotEmpty()
//   @IsString()
//   firstName: string;

//   @ApiProperty({ description: 'Last name of the user', example: 'One' })
//   @IsNotEmpty()
//   @IsString()
//   lastName: string;

//   @ApiProperty({
//     description: 'Email of the user',
//     example: 'client1@axistify.com',
//   })
//   @IsNotEmpty()
//   @IsEmail()
//   email: string;

//   // @IsBoolean()
//   // email_verified: boolean;

//   // email_verified_at: Date;

//   @ApiProperty({
//     description: 'Phone Number of the user',
//     example: '6026641456',
//   })
//   @IsNotEmpty()
//   // @IsPhoneNumber()
//   phone: string;

//   // @IsBoolean()
//   // phone_verified: boolean;

//   // phone_verified_at: Date;

//   // status?: 'Active' | 'Blocked';

//   @ApiProperty({ description: 'Password of the user', example: 'Test@123' })
//   @IsNotEmpty()
//   @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
//     message:
//       'Password must be at least 8 characters long and include at least one letter, one number, and one special character',
//   })
//   password: string;

//   @ApiProperty({
//     description: 'Role of the user',
//     enum: UserRole,
//     example: UserRole.CLIENT,
//   })
//   @IsEnum(UserRole, { message: 'Role must be one of: admin, doctor, client' })
//   role?: UserRole;

//   @ApiProperty({ description: 'Address of the user' })
//   address?: string;

//   @IsNotEmpty()
//   @IsString()
//   city: string;

//   @IsNotEmpty()
//   @IsString()
//   state: string;

//   @IsNotEmpty()
//   @IsString()
//   zipCode: string;

//   @IsNotEmpty()
//   @IsString()
//   description: string;

//   @ApiProperty({ description: 'Company of the user' })
//   @IsNotEmpty()
//   @IsString()
//   companyId?: string;

//   programs?: string[];
// }

import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  IsArray,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  CLIENT = 'client',
}

export class User {
  id: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'Client',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'One',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'client1@abc.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Phone Number of the user',
    example: '6026641456',
  })
  @IsNotEmpty()
  phone: string;

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
    description: 'Role of the user',
    enum: UserRole,
    example: UserRole.CLIENT,
  })
  @IsEnum(UserRole, { message: 'Role must be one of: admin, doctor, client' })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Address of the user',
  })
  address?: string;

  @ApiProperty({
    description: 'City of the user',
    example: 'Phoenix',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'State of the user',
    example: 'AZ',
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    description: 'Zip Code of the user',
    example: '85001',
  })
  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @ApiProperty({
    description: 'Description of the user',
    example: 'This is a sample user description.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Company ID associated with the user',
  })
  @ValidateIf(o => o.role == "admin")
  @IsNotEmpty()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  doctorId?: string;

  @ApiPropertyOptional({
    description: 'Program ids associated with the user',
    type: [String],
    example: ['Program A', 'Program B'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  programs?: string[];
}
