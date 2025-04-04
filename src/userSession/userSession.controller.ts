import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserSessionService } from './userSession.service';
import { RegisterSessionDeviceDto } from './dto/register-device.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('userSessions')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class UserSessionController {
  constructor(private readonly userSessionService: UserSessionService) {}

  @Post('registerDevice')
  registerDevice(@Body() body: RegisterSessionDeviceDto) {
    const { userId, fcmToken } = body;
    this.userSessionService.registerDevice({ userId, fcmToken });
    return { success: true, message: 'Device registered successfully' };
  }
}
