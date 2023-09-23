import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { getFirestore, connectFirestoreEmulator } from '@firebase/firestore';

@Injectable()
export class FirebaseService {
  private readonly firestore: admin.firestore.Firestore;

  constructor() {
    let appInitilized = false;
    console.log('do firebase');
    admin.apps.forEach((app) => {
      if (app.name === 'socialApp') {
        appInitilized = true;
      }
    });
    if (!appInitilized) {
      if (process.env.NODE_ENV === 'test') {
        this.firestore = admin
          .initializeApp(
            {
              credential: admin.credential.applicationDefault(),
            },
            'socialApp',
          )
          .firestore();
        // const db = getFirestore();
        // connectFirestoreEmulator(db, '127.0.0.1', 8080);
      } else {
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
      }
    } else {
      this.firestore = admin.app('socialApp').firestore();
    }
    console.log('za firebase');
  }

  getFirestore() {
    return this.firestore;
  }
}
