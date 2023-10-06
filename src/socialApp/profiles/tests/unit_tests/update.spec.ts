import { TestingModule } from '@nestjs/testing';
import { ProfilesService } from '../../profiles.service';
import { createTestEnv, getTestingModule } from '../../../database/testingModule';
import { FirebaseService } from '../../../database/firebase.service';
import {
  updateProfileWithEmptyPassword,
  updateProfileWrongId,
  updatedProfile,
} from '../mocks/mockedProfiles';
import { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { getUserFromFirebase } from '../helpFunctions/getUserFromFirebase';
import { seedProfiles } from '../mocks/seedProfiles';

describe('Profiles service -> Update', () => {
  let profilesService: ProfilesService;
  let firebaseService: FirebaseService;
  let module: TestingModule;
  let testEnv: RulesTestEnvironment;

  beforeEach(async () => {
    testEnv = await createTestEnv();
    module = await getTestingModule([ProfilesService, FirebaseService]);
    profilesService = module.get<ProfilesService>(ProfilesService);
    firebaseService = module.get<FirebaseService>(FirebaseService);
    await seedProfiles();
  });

  afterEach(async () => {
    await testEnv.clearFirestore();
    module.close();
  });

  it('Update user normal', async () => {
    const response = await profilesService.update(updatedProfile);
    expect(response).toEqual({ statusCode: 200 });
    const newProfile = await getUserFromFirebase(
      updatedProfile.Id,
      firebaseService,
    );
    expect(newProfile).toEqual(updatedProfile);
  });

  it('Empty password or Email', async () => {
    await expect(
      profilesService.update(updateProfileWithEmptyPassword),
    ).rejects.toThrow('Email and Password are required');
  });

  it('Wrong id', async () => {
    await expect(
      profilesService.update(updateProfileWrongId),
    ).rejects.toThrow();
  });
});
