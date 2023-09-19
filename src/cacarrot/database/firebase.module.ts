import { forwardRef, Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Module({
  controllers: [],
  providers: [FirebaseService],
  imports: [],
  exports: [FirebaseService],
})
export class FirebaseModule {}
