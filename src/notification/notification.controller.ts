import { Controller, Get, Query } from '@nestjs/common';

import { NotificationService } from './notification.service';

import { GetNotificationDto } from './dto/get-notifications.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Public } from 'src/decorators/public-route.decorators';

@Controller('notifications')
@ApiBearerAuth()

// @UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items to return',
    default: 15,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    default: 1,
  })
  getAllNotification(@Query() query: GetNotificationDto) {
    return this.notificationService.getNotification(query);
  }
}
