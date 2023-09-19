import { forwardRef, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { FirebaseModule } from '../database/firebase.module';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [forwardRef(() => FirebaseModule)],
  exports: [MessagesService],
})
export class MessagesModule {}
