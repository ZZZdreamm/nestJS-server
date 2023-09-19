import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { ProfilesModule } from '../profiles/profiles.module';
import { FirebaseModule } from '../database/firebase.module';


@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [forwardRef(() => ProfilesModule), forwardRef(() => FirebaseModule)],
  exports: [PostsService],
})
export class PostsModule {}
