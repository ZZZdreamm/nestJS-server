import { TestingModule } from '@nestjs/testing';
import { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { createTestEnv, getTestingModule } from '../../../database/testingModule';
import { FirebaseService } from '../../../database/firebase.service';
import { seedProfiles } from '../mocks/seedProfiles';
import { profileId, profileWithImage } from '../mocks/mockedProfiles';
import { ProfilesService } from '../../profiles.service';

describe('Profile service -> getProfile', () => {
  let profilesService: ProfilesService;
  let module: TestingModule;
  let testEnv: RulesTestEnvironment;

  beforeEach(async () => {
    testEnv = await createTestEnv();
    module = await getTestingModule([ProfilesService, FirebaseService]);
    profilesService = module.get<ProfilesService>(ProfilesService);
    await seedProfiles();
  });

  afterEach(async () => {
    await testEnv.clearFirestore();
    module.close();
  });

  it('Get user profile', async () => {
    const result = await profilesService.getProfile(profileId);
    expect(result).toEqual(profileWithImage);
  });

  it('Get user profile with wrong id', async () => {
    await expect(profilesService.getProfile('wrongId')).rejects.toThrow(
      'User does not exist',
    );
  });
});
