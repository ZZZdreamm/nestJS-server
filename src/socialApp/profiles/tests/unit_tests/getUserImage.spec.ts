import { TestingModule } from '@nestjs/testing';
import { ProfilesService } from '../../profiles.service';
import { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import {
  createTestEnv,
  getTestingModule,
} from '../../../database/testingModule';
import { FirebaseService } from '../../../database/firebase.service';
import { seedProfiles } from '../mocks/seedProfiles';
import { allProfilesWithMark } from '../mocks/mockedProfiles';

describe('Profiles service -> getUserImage', () => {
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

  it('Get user image', async () => {
    const result = await profilesService.getUserImage(
      allProfilesWithMark[0].Id,
    );
    expect(result).toEqual(allProfilesWithMark[0].ProfileImage);
  });

  it('Get user image with invalid id', async () => {
    await expect(
      profilesService.getUserImage('invalid id'),
    ).rejects.toThrowError();
  });

  it('Get image that doesnt exist', async () => {
    const result = await profilesService.getUserImage(
      allProfilesWithMark[3].Id,
    );

    expect(result).toBeUndefined();
  });
});
