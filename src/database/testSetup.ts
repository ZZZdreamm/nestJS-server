import * as functionsTest from 'firebase-functions-test';
import * as firebase from 'firebase-admin';
import { getFirestore, connectFirestoreEmulator } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCncHs0oDoCmDveoAMZvSkLXuc4syN2Mg4',
  authDomain: 'facebugserver.firebaseapp.com',
  databaseURL:
    'https://facebugserver-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'facebugserver',
  storageBucket: 'facebugserver.appspot.com',
  messagingSenderId: '915472090039',
  appId: '1:915472090039:web:532f827244997362d29e32',
};

const test = functionsTest(firebaseConfig, 'socialAppFirebaseCredentials.json');

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

afterAll(() => {
  test.cleanup();
});
