import * as functionsTest from 'firebase-functions-test';
import * as firebase from 'firebase-admin';
import { getFirestore, connectFirestoreEmulator } from '@firebase/firestore';



beforeAll(() => {
  const emulatorHost = 'localhost';
  const emulatorPort = 8080;
  process.env.FIRESTORE_EMULATOR_HOST = `${emulatorHost}:${emulatorPort}`;
  firebase.initializeApp({
    projectId: 'facebugserver',
    databaseURL: `http://${emulatorHost}:${emulatorPort}?ns=facebugserver`,
  });
  const db = getFirestore();
  connectFirestoreEmulator(db, emulatorHost, emulatorPort);
});
