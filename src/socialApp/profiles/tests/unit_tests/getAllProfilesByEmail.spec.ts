import { TestingModule } from '@nestjs/testing';
import { ProfilesService } from '../../profiles.service';
import { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { createTestEnv, getTestingModule } from '../../../database/testingModule';
import { FirebaseService } from '../../../database/firebase.service';
import { seedProfiles } from '../mocks/seedProfiles';
import { allProfilesWithMark } from '../mocks/mockedProfiles';

describe('Profiles service -> searchProfilesByEmail', () => {
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

  it('Get all profiles by email', async () => {
    const result = await profilesService.searchProfilesByEmail('mark');
    expect(result).toEqual(allProfilesWithMark);
    expect(result.length).toEqual(4);
  });

  it('There is no profile with given email', async () => {
    const result = await profilesService.searchProfilesByEmail('emptyArray');
    expect(result).toEqual([]);
  });

  it('Empty email was given', async () => {
    const result = await profilesService.searchProfilesByEmail('');
    expect(result).toEqual([]);
  });
});
