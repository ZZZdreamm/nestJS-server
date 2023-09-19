// testing.module.ts
import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseModule } from 'nestjs-firebase';

export async function getTestingModule(providers, controllers): Promise<TestingModule> {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      FirebaseModule.forRoot({
        googleApplicationCredential: 'socialAppFirebaseCredentials.json',
      }),
    ],
    providers: providers,
    controllers: controllers
  }).compile();

  return module;
}
