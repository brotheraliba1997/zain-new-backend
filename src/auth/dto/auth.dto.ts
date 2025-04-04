import { PartialType, PickType } from '@nestjs/swagger';

import { User } from 'src/user/entities/user.entity';
import { Auth } from '../entities/auth.entity';

export class RegisterDto extends PickType(User, [
  'firstName',
  'lastName',
  'email',
  'phone',
  'password',
  'role',
  'address',
  'city',
  'state',
  'zipCode',
  'companyId',
  'programs',
  'doctorId',
]) {}

export class LoginDto extends PickType(User, ['email', 'password']) {}

export class ForgotPasswordDto extends PickType(Auth, ['email']) {}

export class VerifyOtpDto extends PickType(Auth, ['email', 'otp']) {}

export class UpdatePasswordDto extends PickType(Auth, ['token', 'password']) {}
