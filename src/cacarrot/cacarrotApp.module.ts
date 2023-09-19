import { Module } from '@nestjs/common';
import { FirebaseService } from './database/firebase.service';
import { FirebaseModule } from './database/firebase.module';

@Module({
  imports: [FirebaseModule],
  exports: [FirebaseModule],
  controllers: [],
  providers: [FirebaseService],
})
export class CacarrotAppModule {}
