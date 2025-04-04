import { PickType } from '@nestjs/swagger';
import { Notification } from '../entities/notification.entity';

export class CreateNotificationDto extends PickType(Notification, [
  'type',
  'title',
  'message',
  'data',
  'createdAt',
  'recipients',
]) {}
