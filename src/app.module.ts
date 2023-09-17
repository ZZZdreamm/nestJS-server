import { Module } from '@nestjs/common';
import { FirebaseModule } from 'nestjs-firebase';
import { ProfilesController } from './profiles/profiles.controller';
import { ProfilesService } from './profiles/profiles.service';
import { ProfilesModule } from './profiles/profiles.module';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    FirebaseModule.forRoot({
      googleApplicationCredential: 'socialAppFirebaseCredentials.json',
    }),
    ProfilesModule,
    PostsModule,
  ],
  exports: [FirebaseModule],
  controllers: [ProfilesController, PostsController],
  providers: [ProfilesService, PostsService],
})
export class AppModule {}
