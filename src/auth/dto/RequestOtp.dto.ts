import { PartialType, PickType } from '@nestjs/swagger';

import { User } from 'src/user/entities/user.entity';

export class RequestOtpDto {
  email: string;
}


export class VerifyOtpDto {
  otp: string;
  email: string;
}


export class updatePasswordOptDto {
  password: string;
  email: string;
  token: string
}

