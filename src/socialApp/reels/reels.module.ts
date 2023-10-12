import { forwardRef, Module } from '@nestjs/common';
import { FirebaseModule } from '../database/firebase.module';
import { ReelsService } from './reels.service';
import { ReelsController } from './reels.controller';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  controllers: [ReelsController],
  providers: [ReelsService],
  imports: [forwardRef(() => FirebaseModule), forwardRef(() => ProfilesModule)],
  exports: [ReelsService],
})
export class ReelsModule {}
