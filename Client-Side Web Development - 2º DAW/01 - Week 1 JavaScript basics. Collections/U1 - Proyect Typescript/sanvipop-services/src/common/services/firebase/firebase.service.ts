import { Injectable } from '@nestjs/common';
import { getMessaging, type Message } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseService {
  async sendMessage(
    token: string,
    title: string,
    body: string,
    data: { [key: string]: string } | undefined,
  ): Promise<string> {
    const message: Message = {
      notification: {
        title,
        body,
      },
      data,
      token,
    };

    try {
      const resp = await getMessaging().send(message);
      return resp;
    } catch (e) {
      return 'Error: ' + (e as Error).message;
    }
  }
}
