import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';

@Injectable()
export class FirebaseService {
  private readonly database: admin.database.Database;

  constructor() {
    let appInitilized = false;
    admin.apps.forEach((app) => {
      if (app.name === 'cacarrot') {
        appInitilized = true;
      }
    });
    if (!appInitilized) {
      this.database = admin
        .initializeApp(
          {
            credential: admin.credential.cert({
              projectId: process.env.CACARROT_PROJECT_ID,
              clientEmail: process.env.CACARROT_CLIENT_EMAIL,
              privateKey: process.env.CACARROT_PRIVATE_KEY.replace(
                /\\n/g,
                '\n',
              ),
            }),
            databaseURL: process.env.CACARROT_DATABASE_URL,
          },

          'cacarrot',
        )
        .database();
    }
  }

  getDatabase() {
    return this.database;
  }
}
