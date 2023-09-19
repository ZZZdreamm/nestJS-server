import { Module } from '@nestjs/common';
import { FirebaseModule } from 'nestjs-firebase';
import { ProfilesController } from './profiles/profiles.controller';
import { ProfilesService } from './profiles/profiles.service';
import { ProfilesModule } from './profiles/profiles.module';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { CommentsModule } from './comments/comments.module';
import { MessagesController } from './messages/messages.controller';
import { MessagesService } from './messages/messages.service';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    FirebaseModule.forRoot({
      googleApplicationCredential: 'socialAppFirebaseCredentials.json',
    }),
    ProfilesModule,
    PostsModule,
    CommentsModule,
    MessagesModule,
  ],
  exports: [FirebaseModule],
  controllers: [
    ProfilesController,
    PostsController,
    CommentsController,
    MessagesController,
  ],
  providers: [ProfilesService, PostsService, CommentsService, MessagesService],
})
export class AppModule {}
