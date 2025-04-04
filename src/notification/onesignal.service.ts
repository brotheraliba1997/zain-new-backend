import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OneSignalService {
  private playerIdMap: Map<string, string> = new Map();

  private readonly ONE_SIGNAL_APP_ID = 'e16c39ae-3977-4369-bb5e-c6f80a1f4289';
  private readonly ONE_SIGNAL_API_KEY =
    'os_v2_app_4fwdtlrzo5bwto26y34auh2crfcpr5owj4pus3ms35klwdfkw3n7kehycfvx5es3bz7m5g36botzxkemanzljfvmo53a3k47ydcwnyq';
  private readonly ONE_SIGNAL_API_URL =
    'https://onesignal.com/api/v1/notifications';

  // Save Player ID to Map
  connect(userId: string, playerId: string) {
    this.playerIdMap.set(userId, playerId);
    console.log(`Mapped ${userId} -> ${playerId}`);
  }

  // Get Player ID by User ID
  getPlayerId(userId: string): string | undefined {
    return this.playerIdMap.get(userId);
  }

  async sendNotification(userIds: string, notification: any) {
    // userIds.forEach((userId) => {
    console.log('chec==>', userIds, notification, this.playerIdMap);
    const playerId = this.playerIdMap.get(userIds[0]);
    if (!playerId) {
      // throw new Error('Player ID not found.');
      return;
    }

    console.log('playerId=>', playerId);
    const response = await axios.post(
      this.ONE_SIGNAL_API_URL,
      {
        app_id: this.ONE_SIGNAL_APP_ID,
        include_player_ids: [playerId],
        headings: { en: notification.title },
        contents: { en: notification.message },
        data: notification,
      },
      {
        headers: {
          Authorization: `Basic ${this.ONE_SIGNAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  }
}
