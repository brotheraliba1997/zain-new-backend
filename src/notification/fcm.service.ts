import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { UserSessionService } from 'src/userSession/userSession.service';

@Injectable()
export class FCMService {
  private fcmTokenMap: Map<string, string> = new Map();

  private messaging: admin.messaging.Messaging;

  constructor(private readonly userSessionService: UserSessionService) {
    // Initialize Firebase Admin SDK

    admin.initializeApp({
      credential: admin.credential.cert(
        path.join(
          __dirname,
          '../../src/notification/firebase-service-account.json',
        ),
      ),
    });
    this.messaging = admin.messaging();
  }

  saveFCMToken(userId: string, fcmToken: string) {
    this.fcmTokenMap.set(userId, fcmToken);
    console.log(`Mapped ${userId} -> ${fcmToken}`);
  }

  async sendNotification(userIds: string[], notification: any) {
    // const fcmToken = this.fcmTokenMap.get(userIds[0]);
    const fcmTokens = await this.userSessionService.getFCMTokens(userIds);

    // console.log('fcmToken=>', fcmToken, this.fcmTokenMap);
    // const fcmToken =
    //   'f1xMzTy_TaG2fTEDucBsMe:APA91bEjN8FPfGn59P3IO42v_sZNM1m5vP5BhUIWojJUzQUSp-sKZQV8wKpX0B6wtDUB8WhLA3TYJQwVBjARmmyXzKUSW8m2SPqQ_HjrpmXHMoxLnMw-fts';
    if (fcmTokens.length == 0) {
      // throw new Error('Player ID not found.');
      return;
    }

    console.log('noti->', notification);
    const message = {
      tokens: fcmTokens,
      notification: {
        title: notification.title,
        body: 'notification.message',
      },
      // data: notification,
      data: notification.data,
      // data: {
      //   type: notification.type,
      //   meetingId: notification.id,
      //   scheduledMeetingId: notification.id,
      // },
    };

    try {
      const response = await this.messaging.sendEachForMulticast(message);
      console.log('Notification sent successfully:', response);
      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }
}
