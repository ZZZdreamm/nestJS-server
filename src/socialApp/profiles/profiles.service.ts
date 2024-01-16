import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateProfileDto } from './dto/createProfileDto';
import { Profile } from './entities/profile.entity';
import { UserCredentials } from './dto/userCredentials';
import { ProfileDto } from './dto/profileDto';
import { UpdateProfileDto } from './dto/updateProfileDto';
import { FirebaseService } from '../database/firebase.service';
import { createWebToken } from '../authentication/createJwtToken';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject(forwardRef(() => FirebaseService))
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    if (!createProfileDto.Email || !createProfileDto.Password) {
      throw new Error('Invalid login or password');
    }
    let createdProfile: Profile;
    const userProfile = { Roles: ['user'], ...createProfileDto };
    await this.firebaseService
      .getFirestore()
      .collection('Users')
      .add(userProfile)
      .then((res) => {
        createdProfile = {
          Id: res.id,
          ProfileImage: '',
          ...userProfile,
        };
      });
    const token = createWebToken(createdProfile);
    return { token: token, user: createdProfile };
  }

  async login(credentials: UserCredentials) {
    if (!credentials.Email || !credentials.Password) {
      throw new Error('Invalid login or password');
    }
    let profile: Profile = {
      Id: '',
      Email: '',
      ProfileImage: '',
      Password: '',
    };
    const usersCollectionData = await this.firebaseService
      .getFirestore()
      .collection('Users')
      .get();
    usersCollectionData.forEach((snapshot) => {
      const user = snapshot.data();
      if (
        user.Email === credentials.Email &&
        user.Password === credentials.Password
      ) {
        profile.Id = snapshot.id;
        profile.Email = user.Email;
        profile.ProfileImage = user.ProfileImage;
        profile.Roles = user?.Roles;
      }
    });
    if (profile.Id) {
      const token = createWebToken(profile);
      return { token: token, user: profile };
    } else {
      throw new Error('User does not exist');
    }
  }

  async getProfile(id: string): Promise<ProfileDto> {
    const usersCollection = this.firebaseService
      .getFirestore()
      .collection('Users');
    const profileData = (await usersCollection.doc(id).get()).data();
    if (!profileData) {
      throw new Error('User does not exist');
    }
    return {
      Id: id,
      Email: profileData?.Email,
      ProfileImage: profileData?.ProfileImage,
    };
  }

  async searchProfilesByEmail(
    query: string,
    userId: string = '',
  ): Promise<ProfileDto[]> {
    if (!query) return [];
    const snapshot = await this.firebaseService
      .getFirestore()
      .collection('Users')
      .get();
    // Wanted to use some points system for searching to give more relevant results
    // but it would be very unefficient for document based database
    // and it would be too much work to rebuild it to use e.g. SQL database
    let profiles: ProfileDto[] = [];
    snapshot.forEach((shot) => {
      if (profiles.length === 5) return;
      const user = shot.data();
      if (user.Email.toLowerCase().includes(query.toLowerCase())) {
        profiles.push({
          Id: shot.id,
          Email: user.Email,
          ProfileImage: user.ProfileImage,
        });
      }
    });
    return profiles;
  }

  async update(profileDto: UpdateProfileDto) {
    if (!profileDto.Email || !profileDto.Password)
      throw new Error('Email and Password are required');
    const { Id, ...restOfProfile } = profileDto;
    const usersCollection = this.firebaseService
      .getFirestore()
      .collection('Users');
    return await usersCollection
      .doc(Id)
      .update({ ...restOfProfile })
      .then(() => {
        return { statusCode: 200 };
      });
  }

  async getUserImage(id: string) {
    let image: string = null;
    const usersCollection = await this.firebaseService
      .getFirestore()
      .collection('Users');

    await usersCollection.get().then((querySnapshot) => {
      querySnapshot.forEach((user) => {
        const data = user.data();
        if (data.Id == id) {
          image = data.ProfileImage;
        }
      });

    });
    return image;
  }

  async sendFriendRequest(userId: string, friendId: string) {
    const userRef = this.firebaseService
      .getFirestore()
      .collection('Users')
      .doc(userId)
      .collection('SentFriendRequests');
    const friendRef = this.firebaseService
      .getFirestore()
      .collection('Users')
      .doc(friendId)
      .collection('FriendRequests');
    userRef.doc(friendId).set({});
    friendRef.doc(userId).set({});
    const friendDoc = await this.firebaseService
      .getFirestore()
      .collection('Users')
      .doc(friendId)
      .get();
    const friendData = friendDoc.data();
    const friend: ProfileDto = {
      Id: friendDoc.id,
      Email: friendData.Email,
      ProfileImage: friendData.ProfileImage,
    };
    return friend;
  }

  async acceptFriendRequest(userId: string, friendId: string) {
    const usersRef = this.firebaseService.getFirestore().collection('Users');
    const userRef = usersRef.doc(userId).collection('FriendRequests');
    const friendRef = usersRef.doc(friendId).collection('SentFriendRequests');
    await userRef.doc(friendId).delete();
    await friendRef.doc(userId).delete();

    const userFriendsRef = usersRef.doc(userId).collection('Friends');
    const friendFriendsRef = usersRef.doc(friendId).collection('Friends');
    await userFriendsRef.doc(friendId).set({});
    await friendFriendsRef.doc(userId).set({});

    const friendDoc = await usersRef.doc(friendId).get();
    const friendData = friendDoc.data();
    const friend: ProfileDto = {
      Id: friendDoc.id,
      Email: friendData.Email,
      ProfileImage: friendData.ProfileImage,
    };
    return friend;
  }

  async removeFriendRequest(userId: string, friendId: string) {
    const usersRef = this.firebaseService.getFirestore().collection('Users');
    const userRef = usersRef.doc(userId).collection('SentFriendRequests');
    const friendRef = usersRef.doc(friendId).collection('FriendRequests');
    await userRef.doc(friendId).delete();
    await friendRef.doc(userId).delete();
    return { Id: friendId };
  }

  async getFriendsRequests(userId: string) {
    const userRef = this.firebaseService
      .getFirestore()
      .collection('Users')
      .doc(userId)
      .collection('FriendRequests');
    const requestsIds = await this.getFirebaseDocsIds(userRef);
    return this.getFirebaseProfilesByIds(requestsIds);
  }

  async getSentFriendRequests(userId: string) {
    const usersRef = this.firebaseService
      .getFirestore()
      .collection('Users')
      .doc(userId)
      .collection('SentFriendRequests');
    const requestsIds = await this.getFirebaseDocsIds(usersRef);
    return this.getFirebaseProfilesByIds(requestsIds);
  }

  // //dodac
  // async getUser(id: string) {
  //   const usersRef = this.firebaseService.getFirestore().collection('Users');
  //   const snapshot = usersRef.doc(id);

  //   let thisUser: ProfileDto = {
  //     Id: '',
  //     Email: '',
  //     ProfileImage: '',
  //   };
  //   await snapshot.get().then(async (querySnapshot: any) => {
  //     const data = querySnapshot.data();
  //     thisUser = {
  //       Id: querySnapshot.id,
  //       Email: data?.Email,
  //       ProfileImage: data?.ProfileImage,
  //     };
  //   });
  //   return thisUser;
  // }

  async getFriends(userId: string) {
    const usersRef = this.firebaseService
      .getFirestore()
      .collection('Users')
      .doc(userId)
      .collection('Friends');
    const friendIds = await this.getFirebaseDocsIds(usersRef);
    return this.getFirebaseProfilesByIds(friendIds);
  }

  private async getFirebaseProfilesByIds(profilesIds: string[]) {
    const requestUsers: ProfileDto[] = [];
    await Promise.all(
      profilesIds.map(async (profileId: string) => {
        const requestUser = await this.getProfile(profileId);
        requestUsers.push(requestUser);
      }),
    );
    return requestUsers;
  }

  private async getFirebaseDocsIds(
    firebaseRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  ) {
    const listOfDocsIds = (await firebaseRef.get()).docs.map((doc: any) => {
      return doc.id;
    });
    return listOfDocsIds;
  }

  async removeFriend(userId: string, friendId: string) {
    const usersRef = this.firebaseService.getFirestore().collection('Users');
    const userRef = usersRef.doc(userId).collection('Friends');
    const friendRef = usersRef.doc(friendId).collection('Friends');
    userRef.doc(friendId).delete();
    friendRef.doc(userId).delete();
    return { Id: friendId };
  }

  async checkIfInFriends(userId: string, friendId: string) {
    const userRef = this.firebaseService
      .getFirestore()
      .collection('Users')
      .doc(userId);
    if (userId == friendId) {
      return 'me';
    }
    const inFriends = (await userRef.collection('Friends').doc(friendId).get())
      .exists;
    if (inFriends) return 'inFriends';

    const inFriendRequests = (
      await userRef.collection('SentFriendRequests').doc(friendId).get()
    ).exists;
    if (inFriendRequests) return 'inFriendRequests';

    const pendingRequest = (
      await userRef.collection('FriendRequests').doc(friendId).get()
    ).exists;
    if (pendingRequest) return 'pendingRequest';

    return 'stranger';
  }

  searchFriends(friends: ProfileDto[], searchName: string) {
    return friends.filter((friend) => {
      return friend.Email.toLowerCase().includes(searchName.toLowerCase());
    });
  }
}
