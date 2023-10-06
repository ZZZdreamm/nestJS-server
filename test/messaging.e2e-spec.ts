import { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ProfilesService } from '../src/socialApp/profiles/profiles.service';
import { FirebaseService } from '../src/socialApp/database/firebase.service';
import { seedFriends } from '../src/socialApp/profiles/tests/mocks/seedFriends';
import {
  createTestEnv,
  getTestingModule,
} from '../src/socialApp/database/testingModule';
import { allProfilesWithMark } from '../src/socialApp/profiles/tests/mocks/mockedProfiles';
import { MessagesService } from '../src/socialApp/messages/messages.service';
import { MessageCreateDto } from '../src/socialApp/messages/dto/messageCreateDto';
import { e2eResponseMessage } from '../src/socialApp/messages/tests/mocks/mockedMessages';

describe('Message controller -> Messaging other user', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testEnv: RulesTestEnvironment;

  beforeEach(async () => {
    testEnv = await createTestEnv();
    module = await getTestingModule([
      ProfilesService,
      MessagesService,
      FirebaseService,
    ]);
    await seedFriends();
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await testEnv.clearFirestore();
    module.close();
    await app.close();
  });

  it('Send message to friend', async () => {
    // Get user
    const firstUserId = allProfilesWithMark[0].Id;
    const secondUserId = allProfilesWithMark[1].Id;
    const req = request(app.getHttpServer());
    const firstUser = (
      await req.get(`/profiles/one/${firstUserId}`).expect(200)
    ).body;

    // Send message
    const newMessage: MessageCreateDto = {
      SenderId: firstUserId,
      ReceiverId: secondUserId,
      TextContent: 'Test message',
      SenderName: firstUser.Email,
      Date: 123456789,
    };
    const responseMessage = (
      await req.post(`/messages/send`).send(newMessage).expect(201)
    ).body;

    // Check if first user has the message
    await req
      .get(`/messages/getMessage`)
      .query({
        userId: firstUserId,
        friendId: secondUserId,
        messageId: responseMessage.Id,
      })
      .expect(200, { Id: responseMessage.Id, ...newMessage });

    // Check if second user has the message
    await req
      .get(`/messages/getMessage`)
      .query({
        userId: secondUserId,
        friendId: firstUserId,
        messageId: responseMessage.Id,
      })
      .expect(200, { Id: responseMessage.Id, ...newMessage });
  });
});
