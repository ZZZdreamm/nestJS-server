import { Module } from '@nestjs/common';
import { FirebaseModule } from 'nestjs-firebase';
import { ProfilesController } from './profiles/profiles.controller';
import { ProfilesService } from './profiles/profiles.service';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [
    FirebaseModule.forRoot({
      googleApplicationCredential: 'socialAppFirebaseCredentials.json',
    }),
    ProfilesModule,
  ],
  exports: [FirebaseModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class AppModule {}
