import { FirebaseService } from '../../../database/firebase.service';

export const seedProfilesData = [
  {
    Id: 'ASDASD12312sasdwq123sadsadsad',
    Email: 'mark@gmail.com',
    Password: 'Hello1@',
  },
  {
    Id: 'ASDASD12312sasdwq123sadsad',
    Email: 'mark2@gmail.com',
    Password: 'Hello2@',
  },
  {
    Id: 'ASDASD12312sasdwq123sadmag',
    Email: 'mark3@gmail.com',
    Password: 'Hello3@',
    ProfileImage: 'sdsd',
  },
  {
    Id: 'ASDASD12312sasdwq123sad',
    Email: 'mark2@gmail.com',
    Password: 'Hello4@',
    ProfileImage: 'https://i.imgur.com/3GvZX8A.jpg',
  },
];

export async function seedProfiles() {
  const firebaseService = new FirebaseService().getFirestore();
  const batch = firebaseService.batch();
  const collectionRef = firebaseService.collection('Users');
  seedProfilesData.forEach(async (profile) => {
    const docRef = collectionRef.doc(profile.Id);
    batch.set(docRef, profile);
  });
  await batch.commit();
}
