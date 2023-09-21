import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { getFirestore, connectFirestoreEmulator } from '@firebase/firestore';

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
                // projectId: process.env.SOCIALAPP_PROJECT_ID,
                // clientEmail: process.env.SOCIALAPP_CLIENT_EMAIL,
                // privateKey: process.env.SOCIALAPP_PRIVATE_KEY.replace(
                //   /\\n/g,
                //   '\n',
                // ),
                projectId: 'facebugserver',
                clientEmail: 'firebase-adminsdk-vedrm@facebugserver.iam.gserviceaccount.com',
                privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6zEQ2d4Bxn6FR\nm05xGLgsGOIeBgrE9cmc9bbuXiWSX0wkRQPyLOF12GWQhNqEBE1EseDf2LbfyTuG\nnF/XbIJnFaVI0qenFZ4D2JIypULCB14k1qhL99/VT14slVQgOj+DskhuPjJZ7VhT\nZrVZpI7dIEueLXcqSEFmgXtmT/izmwRVaNE7rXKsKoUYEI8Kn2MU6qkEBO7E4FIs\nMf136Q1tlBUiNoJQ+E2gkZckQz5FBTPQdvY2ZAAE8KVxbQgiWsLFPdgRuzdI3NUs\n+Yy22NpWjtl9I7evLinND8e4h4d6EyRGBi6dRDmIpicT2tDiTBub/3iwni44/Nh7\nV/ibNSOvAgMBAAECggEASpvLovWYF8nqZO3jJsj4xqQprFQ9eO2y2T5LEmoIF654\newQVz2SdqLQF3PMzVAdj1Uw2xTGJ2VhGrj1HCoQMkZ/TpIJ+8/1uX5rgydm4EEdh\nEtWp4q3eeRR6SNRcBYM+WxuaUm4FLmXeIXGkfWl8plV/3m3KatjxRj/xSawnaZSS\nJSiX3Vhi5+lgiC7Z2qUwmS85INEQDiOMNbHfDxTUDXXM1ERnTyFNSamcCMbrZz/x\niuDKw8waf4JBVAqq6gM1HH++Z7nfTaV3uXrMJZqGnLXPakFCM55SXyG1gt9wJuJn\n/r/74ANdqM+Q7emNEFWws7uFm6RERjPuTuXr/d+kAQKBgQDg6FQixFUqBvEKw7mK\nhwetRZp0gzf4S/4YBNlmSM4YbHwtxS1VaYgBBQuyn6q42B4zT7Bs8z+g3RvI9aoN\n8Ja+YeRlszlp6/vdCApeczuxZ0whb5WwHeBrTAo5gA7mMok2bk9xCk3ij3yR1FJz\nwZx2wmleH2ki6ic4VWrPrx1yxwKBgQDUnzSh48hSB//PmGoWkp+8tfclUwJQTJCZ\nrA8nwvCtUH0LkXG/LXUHViKhDVRpbvtqLVlqPAiI+nv5DrwaOhPUgiDZ4qapnKz3\nNze7Z4nzMQRSVz/7KHUeS082PAWWk7gZ9V3ps4RyFOLqZcSAPSNtrVbziKknDxEz\nNgCc/iFf2QKBgF9Ns9Fjtt7vQBcapzXvUC55byDuNbpuoUaWT3VLZqHs3pYalsI5\nzNr5w2I2zIY1dl6x5wXT8eN9rndyulPb3lTgcIMz9iFPUVPxQ0uQsvvS1OzaNukB\nUAbHmxGQlT+wrHo3NkylXCmkOdolyaappV6htTqgPtH/vQzfDTribq0jAoGBAIZV\nZ+14epHJWAgS5cQJMz8JQHKmdWnCVgGhQZn/ggweNELgy5rb33qZIxvZziEm61Vz\n/XAvKb1RdI4wjwuK8ghrhtHibyXuRSGUE3QlwHST3YUgdt35+7T+I7fCSE2QWtqb\nuY/zyZRCOfOaBIJ5Hi8nOy52g1iYHmfakJyfuvpRAoGAYR/4o3HkLVrEoHLt/+jt\nyRDDi7F8SViGPt8jFdPbldBZOqdZPiyBAEb79+3n4hWeXHyTKcv5H7XVJ2H35ONX\nSnXUyVKj4kSLkxljFhj+UAg+vGSSAy7zq6KIZrzAv64MKuhHD+hNUazBWNMZama4\ndE3YaR8PQekkWs2ApYb/sVk=\n-----END PRIVATE KEY-----\n',
              }),
            },
            'socialApp',
          )
          .firestore();
      }
    } else {
      this.firestore = admin.app('socialApp').firestore();
    }
  }

  getFirestore() {
    return this.firestore;
  }
}
