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
              // projectId: process.env.CACARROT_PROJECT_ID,
              // clientEmail: process.env.CACARROT_CLIENT_EMAIL,
              // privateKey: process.env.CACARROT_PRIVATE_KEY.replace(
              //   /\\n/g,
              //   '\n',
              // ),
              projectId: 'kakoot-d06ff',
              clientEmail: 'firebase-adminsdk-k7b9k@kakoot-d06ff.iam.gserviceaccount.com',
              privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5XVKe7A4vFP/q\nJAAzWGg+0w7UB3gdNi4BVdt7lAOijl13xLMkg3Zf9WdJI2XXyIxonybgxybTOWNi\nymwr60pnSnWiborBo9kdziOTRmJyNAl3Blg1yV/ztncaDxNh8m2UIjp5NwsvEPVR\nMO3fpTfaOK+g+NOwR+QC9/tAXUwNi5d10EFYTSeq/Wvuwt5PsIP1ryTjBXa3DJ/S\n0+IoHvGSWhq2lo5Kpj6m6asauGdsxDOej5aTX0rRTI092g2mBvlRztUZdLAf+0pb\n4kov2ov4qIprj4DsH8IecAOI51WggBrZeOJNFgPsfFaU/ogN4kIq51hCkZxA0RsE\nvYUDvW5BAgMBAAECggEAAgcoWT7B5Pf42MnuCqHD+jP67IzsXn1yQWd8ED0NUSD3\nmtDXGOYrTF918tHlUlgKWTasiTcEkLkHAlSunEhltv2UjeNhtz6gqHfR4dGaUB+L\nnva9zlDWsOblJK7XinHJix5Yv2y/vZMU6/96CsFW/Bc0rLEsN7iBoRqvcAPVSiyh\nBOgOw3OyNLZZyGYEx0ep+IthTTy+7WtE1uYLumy9MZeMZ/W96r8kT9K1aM9kCtkT\nYheAOG+lqL8mYNBRO8EJ3wfxR5FGPvV1yu+OOBfB2pe3eASibOtO3on7W8OhAOxI\nJ4cf6yhaD23B7Ippr8n5/JCJpALzDhQyw4UsX3U5xQKBgQDkrY4NPRVctNYGnAyP\njhukPhX3K4f4lq7qAj8PO+Qu2FXPG8AomEEl+YuO71thSrQayna3w1oxdXI9PXCU\nItpTn7ZCNZ7Eg+hXn7lvMY6Pb9zhSC98LyIdKNA6Tw1fK8Tp0oa47MqK+KXX+CpE\no4UGvJXfxZMazQyZg2ub4biowwKBgQDPgvb8OcJyoEPIUEih1zQGj3v0ufj4iI12\nM4X2Gh8MKMrP4uhLGeqcFOchsmWlSgJyYvSyj8ym9uCx2CzCrkePLVeo2DZjfi/1\nF8ucoub2VvZ7421tguNMd6Qbb8T65oattAMj63H0kVvnHqwxfcPIoHli3p0CVa9/\nGzpiTV08qwKBgBft+XF1NOkQm1zxs3bKPiY/wPiue3oN+pvORF8Ju2UTilcz5jXZ\nSOf6Zxo7/en+cT5kdWvha2zFh4DVDxTRWNtrWR0wkz6pNwUEV9lE7FAiOpDwhteN\n7xnyDWgsoY+V+vMk7qgnT0KfpmslMvcfzWnZDi3udOhXELx3vij/w90VAoGBALgu\nnPwIZD+LYj5Ui/Mh6Op9xl7UBljKEw079AYY7z/CoSjdVKL8ENGSeAffqPqJcxyG\nGny2x8XWUF9p6WiueZNqgmi556RtZzGaej3AFVHGpCYYGZNe3lKLypwTm3m6zQU2\nRqdGHjIeJr0/60RORU04qiUIQ8HDve4Kg8qmsj/bAoGACZy0DMCfJUt16AyFy3ap\nXSFfA4aP+SoopisPilVZDA0qvYg/0yAnTTIu0bP4Ib7vf5asOLMDwKSg0vJE2XFa\ncbzPvxDe7E9q9GstOU5rnxapmH6tzLqmDg8z9GoEXvJEKJuDz7zSsjqkUgRNqpjV\ninNWhcSU2dQdrBQUg88wOIo=\n-----END PRIVATE KEY-----\n',
            }),
            // databaseURL: process.env.CACARROT_DATABASE_URL,
            databaseURL: 'https://kakoot-d06ff-default-rtdb.firebaseio.com',

          },

          'cacarrot',
        )
        .database();
    } else {
      this.database = admin.app('cacarrot').database();
    }
  }

  getDatabase() {
    return this.database;
  }
}
