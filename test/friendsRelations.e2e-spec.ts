import { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ProfilesService } from '../src/socialApp/profiles/profiles.service';
import { FirebaseService } from '../src/socialApp/database/firebase.service';
import { seedProfiles } from '../src/socialApp/profiles/tests/mocks/seedProfiles';
import {
  createTestEnv,
  getTestingModule,
} from '../src/socialApp/database/testingModule';
import { allProfilesWithMark } from '../src/socialApp/profiles/tests/mocks/mockedProfiles';

describe('Profile controller -> Friends', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testEnv: RulesTestEnvironment;

  beforeEach(async () => {
    testEnv = await createTestEnv();
    module = await getTestingModule([ProfilesService, FirebaseService]);
    await seedProfiles();
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await testEnv.clearFirestore();
    module.close();
    await app.close();
  });

  it('Add friend, get friends, remove friend, get friends', async () => {
    // Get users
    const firstUserId = allProfilesWithMark[0].Id;
    const secondUserId = allProfilesWithMark[1].Id;
    const req = request(app.getHttpServer());
    const firstUser = (
      await req.get(`/profiles/one/${firstUserId}`).expect(200)
    ).body;
    const secondUser = (
      await req.get(`/profiles/one/${secondUserId}`).expect(200)
    ).body;

    // Check if friends are empty
    await req.get(`/profiles/getFriends/${firstUserId}`).expect(200, []);
    await req.get(`/profiles/getFriendRequests/${firstUserId}`).expect(200, []);
    await req
      .get(`/profiles/getSentFriendRequests/${firstUserId}`)
      .expect(200, []);

    // Sent friend request
    await req
      .post(`/profiles/sendFriendRequest`)
      .query({ userId: firstUserId, friendId: secondUserId })
      .expect(201);

    // Check if request was sent
    await req
      .get(`/profiles/getSentFriendRequests/${firstUserId}`)
      .expect(200, [secondUser]);
    await req
      .get(`/profiles/getFriendRequests/${secondUserId}`)
      .expect(200, [firstUser]);

    // Accept friend request
    await req
      .patch(`/profiles/acceptFriendRequest`)
      .query({ userId: secondUserId, friendId: firstUserId })
      .expect(200);

    // Check if friends are not empty
    await req
      .get(`/profiles/getFriends/${firstUserId}`)
      .expect(200, [secondUser]);

    await req
      .get(`/profiles/getFriends/${secondUserId}`)
      .expect(200, [firstUser]);

    // Remove friend
    await req
      .delete(`/profiles/deleteFriend`)
      .query({ userId: firstUserId, friendId: secondUserId })
      .expect(200);

    // Check if friends are empty again
    await req.get(`/profiles/getFriends/${firstUserId}`).expect(200, []);
  });
});
