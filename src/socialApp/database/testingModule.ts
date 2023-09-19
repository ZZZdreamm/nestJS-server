// testing.module.ts
import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseModule } from './firebase.module';

export async function getTestingModule(providers, controllers): Promise<TestingModule> {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      FirebaseModule
    ],
    providers: providers,
    controllers: controllers
  }).compile();

  return module;
}
