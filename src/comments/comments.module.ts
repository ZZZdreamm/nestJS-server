import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [forwardRef(() => ProfilesModule)],
  exports: [CommentsService],
})
export class CommentsModule {}
