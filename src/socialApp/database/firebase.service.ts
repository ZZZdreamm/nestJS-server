import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';

export const EMULATOR_PORT = 8080;

@Injectable()
export class FirebaseService {
  private readonly firestore: admin.firestore.Firestore;

  constructor() {
    let appInitilized = false;
    admin.apps.forEach((app) => {
      if (app.name === 'socialApp') {
        appInitilized = true;
      }
    });
    if (!appInitilized) {
      if (process.env.NODE_ENV === 'test') {
        process.env['FIRESTORE_EMULATOR_HOST'] = `localhost:${EMULATOR_PORT}`;
      }
      this.firestore = admin
        .initializeApp(
          {
            credential: admin.credential.cert({
              projectId: process.env.SOCIALAPP_PROJECT_ID,
              clientEmail: process.env.SOCIALAPP_CLIENT_EMAIL,
              privateKey: process.env.SOCIALAPP_PRIVATE_KEY.replace(
                /\\n/g,
                '\n',
              ),
            }),
          },
          'socialApp',
        )
        .firestore();
    } else {
      this.firestore = admin.app('socialApp').firestore();
    }
  }

  getFirestore() {
    return this.firestore;
  }
}
