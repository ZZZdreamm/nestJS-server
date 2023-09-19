import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { ProfilesModule } from '../profiles/profiles.module';


@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [forwardRef(() => ProfilesModule)],
  exports: [PostsService],
})
export class PostsModule {}
