import { FirebaseService } from '../../../database/firebase.service';
import { seedProfiles, seedProfilesData } from './seedProfiles';

export async function seedFriends() {
  await seedProfiles();
  const userRelations = [
    {
      firstUserId: seedProfilesData[0].Id,
      secondUserId: seedProfilesData[1].Id,
    },
  ];
  const firebaseService = new FirebaseService().getFirestore();
  const batch = firebaseService.batch();
  const collectionRef = firebaseService.collection('Users');
  userRelations.forEach((relation) => {
    const firstUserRef = collectionRef
      .doc(relation.firstUserId)
      .collection('Friends')
      .doc(relation.secondUserId);
    const secondUserRef = collectionRef
      .doc(relation.secondUserId)
      .collection('Friends')
      .doc(relation.firstUserId);
    batch.set(firstUserRef, {});
    batch.set(secondUserRef, {});
  });
}
