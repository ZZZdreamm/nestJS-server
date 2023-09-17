import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { CreateProfileDto } from './dto/createProfileDto';
import { Profile } from './entities/profile.entity';
import { UserCredentials } from './dto/userCredentials';
import { ProfileDto } from './dto/profileDto';
import { UpdateProfileDto } from './dto/updateProfileDto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    let createdProfile: Profile;
    await this.firebase.firestore
      .collection('Users')
      .add(createProfileDto)
      .then((res) => {
        createdProfile = { Id: res.id, ProfileImage: '', ...createProfileDto };
      });

    return createdProfile;
  }

  async login(credentials: UserCredentials): Promise<ProfileDto> {
    let profile: ProfileDto = {
      Id: '',
      Email: '',
      ProfileImage: '',
    };
    const usersCollectionData = await this.firebase.firestore
      .collection('Users')
      .get();
    usersCollectionData.forEach((snapshot) => {
      const user = snapshot.data();
      if (
        user.Email == credentials.Email &&
        user.Password == credentials.Password
      ) {
        profile.Id = snapshot.id;
        profile.Email = user.Email;
        profile.ProfileImage = user.ProfileImage;
      }
    });

    return profile;
  }

  async getProfile(id: string): Promise<ProfileDto> {
    const usersCollection = this.firebase.firestore.collection('Users');
    const profileData = (await usersCollection.doc(id).get()).data();
    return {
      Id: id,
      Email: profileData.Email,
      ProfileImage: profileData.ProfileImage,
    };
  }

  async getAllProfilesByEmail(query: string): Promise<ProfileDto[]> {
    const snapshot = await this.firebase.firestore.collection('Users').get();
    let profiles: ProfileDto[] = [];
    snapshot.forEach((shot) => {
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
    const { Id, ...restOfProfile } = profileDto;
    const usersCollection = this.firebase.firestore.collection('Users');
    return await usersCollection
      .doc(Id)
      .update({ ...restOfProfile })
      .then(() => {
        return { statusCode: 200 };
      });
  }
}
