import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}
  getHello(): string {
    this.firebase.firestore.collection('test').add({may:"test"})
    return 'Hello World!';
  }
}
