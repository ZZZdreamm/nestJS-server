import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { FirebaseService } from '../database/firebase.service';
import { UserCredentials } from './dto/userCredentials';
import { UserDto } from './dto/userDto';
import { createWebToken } from '../auth/jwtToken';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => FirebaseService))
    private readonly firebaseService: FirebaseService,
  ) {}

  async login(userCredentials: UserCredentials) {
    const snapshot = await this.firebaseService
      .getDatabase()
      .ref()
      .child('usersAccounts')
      .once('value');
    const userAccounts = snapshot.val();
    let thisUser: UserDto = { Id: '', Email: '' };
    if (userAccounts) {
      Object.values(userAccounts).forEach((user: any) => {
        if (
          user?.email == userCredentials.Email &&
          user?.password == userCredentials.Password
        ) {
          thisUser.Id = user.id;
          thisUser.Email = user.email;
        }
      });
    }
    return thisUser;
  }

  async register(userCredentials: UserCredentials) {
    const dbRef = this.firebaseService.getDatabase().ref();
    const snapshot = await dbRef.child('usersAccounts').once('value');
    const userAccounts = snapshot.val();
    let noUsersWithUsername = true;
    if (userAccounts) {
      Object.values(userAccounts).forEach((user: any) => {
        if (user.email == userCredentials.Email) {
          noUsersWithUsername = false;
        }
      });
    }
    if (noUsersWithUsername) {
      const user: UserDto = { Id: randomUUID(), Email: userCredentials.Email };
      dbRef.child('usersAccounts').child(user.Id).set({
        id: user.Id,
        email: userCredentials.Email,
        password: userCredentials.Password,
      });
      return user;
    } else {
      return { Id: '', Email: '' };
    }
  }
}
