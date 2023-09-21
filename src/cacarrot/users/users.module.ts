import { forwardRef, Module } from '@nestjs/common';
import { FirebaseService } from '../database/firebase.service';
import { FirebaseModule } from '../database/firebase.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [forwardRef(() => FirebaseModule)],
  exports: [],
})
export class UsersModule {}
