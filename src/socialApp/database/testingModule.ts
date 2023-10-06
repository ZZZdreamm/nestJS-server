// testing.module.ts
import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseModule } from './firebase.module';
import { forwardRef } from '@nestjs/common';
import { ProfilesModule } from '../profiles/profiles.module';
import 'dotenv/config';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { MessagesModule } from '../messages/messages.module';

export async function getTestingModule(providers: any): Promise<TestingModule> {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      forwardRef(() => FirebaseModule),
      forwardRef(() => ProfilesModule),
      forwardRef(() => MessagesModule),
    ],
    providers: providers,
    controllers: [],
  }).compile();

  return module;
}

export async function createTestEnv() {
  const testEnv = await initializeTestEnvironment({
    projectId: 'facebugserver',
    hub: {
      host: '127.0.0.1',
      port: 4400,
    },
  });
  return testEnv;
}
