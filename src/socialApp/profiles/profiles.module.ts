import { forwardRef, Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { FirebaseService } from '../database/firebase.service';
import { FirebaseModule } from '../database/firebase.module';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [forwardRef(() => FirebaseModule)],
  exports: [ProfilesService],
})
export class ProfilesModule {}
