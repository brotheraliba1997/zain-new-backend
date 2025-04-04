import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserSessionService {
  constructor(private prisma: PrismaService) {}

  async registerDevice({
    userId,
    fcmToken,
    deviceInfo = {},
  }: {
    userId: string;
    fcmToken: string;
    deviceInfo?: any;
  }) {
    const sessionId = uuidv4(); // Generate unique sessionId

    return await this.prisma.userSession.upsert({
      where: { fcmToken },
      update: { sessionId, deviceInfo, createdAt: new Date() },
      create: { userId, fcmToken, sessionId, deviceInfo },
    });
  }

  async getFCMTokens(userIds: string[]) {
    const devices = await this.prisma.userSession.findMany({
      where: { userId: { in: userIds } },
      select: { fcmToken: true }, // Only fetch FCM tokens
    });
    return devices.map((device) => device.fcmToken);
  }

  async removeDevice(sessionId: string) {
    await this.prisma.userSession.deleteMany({ where: { sessionId } });
  }
}
