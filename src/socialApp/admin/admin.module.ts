import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { FirebaseModule } from '../database/firebase.module';
import { AdminController } from './admin.controller';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  exports: [],
  imports: [forwardRef(() => FirebaseModule)],
})
export class AdminModule {}
