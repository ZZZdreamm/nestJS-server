// testing.module.ts
import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseModule } from './firebase.module';
import { forwardRef } from '@nestjs/common';
import { ProfilesService } from '../profiles/profiles.service';
import { ProfilesModule } from '../profiles/profiles.module';

export async function getTestingModule(providers: any): Promise<TestingModule> {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      forwardRef(() => FirebaseModule),
      forwardRef(() => ProfilesModule),
    ],
    providers: providers,
    controllers: [],
  }).compile();

  return module;
}
