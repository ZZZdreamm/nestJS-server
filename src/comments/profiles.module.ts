import { forwardRef, Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [],
  exports: [ProfilesService],
})
export class ProfilesModule {}
