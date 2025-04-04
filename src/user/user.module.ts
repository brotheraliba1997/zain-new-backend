import { Module } from '@nestjs/common';
import { UserService } from './user.service';

import { JwtService } from '@nestjs/jwt';

import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
// import { ChatModule } from 'src/chat/chat.module';

// import { DeviceReadingService } from 'src/deviceReading/deviceReading.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [UserService],
})
export class UserModule {}
