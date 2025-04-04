import { Module } from '@nestjs/common';
import { UserSessionService } from './userSession.service';

import { PrismaModule } from 'src/prisma/prisma.module';
import { UserSessionController } from './userSession.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserSessionController],
  providers: [UserSessionService],
  exports: [UserSessionService],
})
export class UserSessionModule {}
