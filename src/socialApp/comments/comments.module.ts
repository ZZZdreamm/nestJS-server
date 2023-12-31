import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { ProfilesModule } from '../profiles/profiles.module';
import { FirebaseModule } from '../database/firebase.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [forwardRef(() => ProfilesModule), forwardRef(()=> FirebaseModule)],
  exports: [CommentsService],
})
export class CommentsModule {}
