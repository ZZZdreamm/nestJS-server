import { TestingModule } from '@nestjs/testing';
import { ProfilesService } from '../../profiles.service';
import { createTestEnv, getTestingModule } from '../../../database/testingModule';
import { FirebaseService } from '../../../database/firebase.service';
import { seedProfiles } from '../mocks/seedProfiles';
import { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import {
  invalidUserCredentials,
  registeredUser,
  unregisteredUser,
} from '../mocks/mockedProfiles';

describe('Profiles service -> Login', () => {
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

  it('User has logged', async () => {
    const result = await profilesService.login(registeredUser);
    expect(result.user.Id).not.toStrictEqual('');
  });

  it('No crendentials', async () => {
    await expect(profilesService.login(invalidUserCredentials)).rejects.toThrow(
      'Invalid login or password',
    );
  });

  it('Wrong credentials', async () => {
    await expect(profilesService.login(unregisteredUser)).rejects.toThrow(
      'User does not exist',
    );
  });
});
