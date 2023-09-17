import { TestingModule } from '@nestjs/testing';
import { ProfilesService } from '../profiles.service';
import { getTestingModule } from '../../database/testingModule';
import { ProfilesController } from '../profiles.controller';

describe('Profiles service', () => {
  let profilesService: ProfilesService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await getTestingModule([ProfilesService], [ProfilesController]);
    profilesService = module.get<ProfilesService>(ProfilesService);
  });

  afterEach(async () => {
    module.close();
  });

  it('User has been created', async () => {
    const result = await profilesService.create({
      Email: 'tester25',
      Password: 'tester',
    });

    expect(result.Id).toBeDefined();
  });
});
