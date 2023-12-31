import { Module } from '@nestjs/common';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { CommentsModule } from './comments/comments.module';
import { MessagesController } from './messages/messages.controller';
import { MessagesService } from './messages/messages.service';
import { MessagesModule } from './messages/messages.module';
import { FirebaseService } from './database/firebase.service';
import { FirebaseModule } from './database/firebase.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ProfilesController } from './profiles/profiles.controller';
import { ProfilesService } from './profiles/profiles.service';
import { WebsocketModule } from './gateways/websocket.module';
import { AuthGuard } from './authentication/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './authentication/auth.module';
import { RolesGuard } from './authorization/roles.guard';
import { AdminModule } from './admin/admin.module';
import { ReelsModule } from './reels/reels.module';
import { ReelsController } from './reels/reels.controller';
import { ReelsService } from './reels/reels.service';

@Module({
  imports: [
    FirebaseModule,
    WebsocketModule,
    ProfilesModule,
    PostsModule,
    CommentsModule,
    MessagesModule,
    AuthModule,
    AdminModule,
    ReelsModule,
  ],
  exports: [],
  controllers: [
    ProfilesController,
    PostsController,
    CommentsController,
    MessagesController,
    ReelsController,
  ],
  providers: [
    ProfilesService,
    PostsService,
    CommentsService,
    MessagesService,
    FirebaseService,
    ReelsService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class SocialAppModule {}
