import { Get, Inject, Injectable, forwardRef } from '@nestjs/common';
import { FirebaseService } from '../database/firebase.service';

@Injectable()
export class AdminService {
  constructor(
    @Inject(forwardRef(() => FirebaseService))
    private readonly firebaseService: FirebaseService,
  ) {}

  async addModeratorPermissions(userId: string) {
    return await this.firebaseService
      .getFirestore()
      .collection('Users')
      .doc(userId)
      .update({
        Roles: ['User', 'Moderator'],
      });
  }
}
