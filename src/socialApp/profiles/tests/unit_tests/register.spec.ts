import { TestingModule } from '@nestjs/testing';
import { ProfilesService } from '../../profiles.service';
import { createTestEnv, getTestingModule } from '../../../database/testingModule';
import { FirebaseService } from '../../../database/firebase.service';
import {
  invalidUserCredentials,
  validUserCredentials,
} from '../mocks/mockedProfiles';
import { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { Profile } from '../../entities/profile.entity';

describe('Profiles service -> Register', () => {
  let profilesService: ProfilesService;
  let module: TestingModule;
  let testEnv: RulesTestEnvironment;

  beforeEach(async () => {
    testEnv = await createTestEnv();
    module = await getTestingModule([ProfilesService, FirebaseService]);
    profilesService = module.get<ProfilesService>(ProfilesService);
  });

  afterEach(async () => {
    await testEnv.clearFirestore();
    module.close();
  });

  it('User has been created', async () => {
    const result: { token: string; user: Profile } =
      await profilesService.create(validUserCredentials);

    expect(result.user.Id).toBeDefined();
  });

  it('Wrong credentials throw Error', async () => {
    await expect(
      profilesService.create(invalidUserCredentials),
    ).rejects.toThrow('Invalid login or password');
  });
});
