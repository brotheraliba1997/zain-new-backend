import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class CreateUserDto extends PickType(User, [
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
