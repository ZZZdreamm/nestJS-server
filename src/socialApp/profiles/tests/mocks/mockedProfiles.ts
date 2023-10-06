import { UpdateProfileDto } from '../../dto/updateProfileDto';
import { UserCredentials } from '../../dto/userCredentials';

export const validUserCredentials: UserCredentials = {
  Email: 'tester25@gmail.com',
  Password: 'tester',
};

export const invalidUserCredentials = {
  Email: '',
  Password: '',
};

export const registeredUser = {
  Email: 'mark@gmail.com',
  Password: 'Hello1@',
};

export const unregisteredUser = {
  Email: 'mark1241@gmail.com',
  Password: 'Hello1@',
};

export const profileId = 'ASDASD12312sasdwq123sad';

export const profileWithImage = {
  Id: 'ASDASD12312sasdwq123sad',
  Email: 'mark2@gmail.com',
  ProfileImage: 'https://i.imgur.com/3GvZX8A.jpg',
};

export const allProfilesWithMark = [
  {
    Id: 'ASDASD12312sasdwq123sad',
    Email: 'mark2@gmail.com',
    ProfileImage: 'https://i.imgur.com/3GvZX8A.jpg',
  },
  {
    Id: 'ASDASD12312sasdwq123sadmag',
    Email: 'mark3@gmail.com',
    ProfileImage: 'sdsd',
  },
  {
    Id: 'ASDASD12312sasdwq123sadsad',
    Email: 'mark2@gmail.com',
    ProfileImage: undefined,
  },
  {
    Id: 'ASDASD12312sasdwq123sadsadsad',
    Email: 'mark@gmail.com',
    ProfileImage: undefined,
  },
];

export const updatedProfile: UpdateProfileDto = {
  Id: 'ASDASD12312sasdwq123sad',
  Email: 'updatedProfile@gmail.com',
  Password: 'Hello1@',
  ProfileImage: 'test image',
};

export const updateProfileWithEmptyPassword: UpdateProfileDto = {
  Id: 'ASDASD12312sasdwq123sad',
  Email: 'updatedProfile@gmail.com',
  Password: '',
  ProfileImage: 'test image',
};

export const updateProfileWrongId: UpdateProfileDto = {
  Id: '123e1fwvdsadw',
  Email: 'updatedProfile@gmail.com',
  Password: 'Hello1@',
  ProfileImage: 'test image',
};
