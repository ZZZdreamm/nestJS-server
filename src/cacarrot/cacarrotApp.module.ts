import { Module } from '@nestjs/common';
import { FirebaseService } from './database/firebase.service';
import { FirebaseModule } from './database/firebase.module';
import { WebsocketModule } from './gateways/websocket.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [FirebaseModule, WebsocketModule, UsersModule],
  exports: [FirebaseModule],
  controllers: [UsersController],
  providers: [FirebaseService, UsersService],
})
export class CacarrotAppModule {}
