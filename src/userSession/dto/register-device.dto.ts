import { PickType } from '@nestjs/swagger';
import { UserSession } from '../entities/userSession.entity';

export class RegisterSessionDeviceDto extends PickType(UserSession, [
  'fcmToken',
  'userId',
]) {}
