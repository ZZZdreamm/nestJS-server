import { FirebaseService } from '../../../database/firebase.service';

export async function getUserFromFirebase(
  docId: string,
  firebaseService: FirebaseService,
) {
  const doc = await firebaseService
    .getFirestore()
    .collection('Users')
    .doc(docId)
    .get();
  if (doc.exists) {
    return doc.data();
  } else {
    return null;
  }
}
