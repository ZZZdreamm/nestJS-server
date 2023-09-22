// import { Module, forwardRef } from '@nestjs/common';
// import { WebsocketGateway } from './websocket.gateway';
// import { MessagesModule } from '../messages/messages.module';
// import { FirebaseModule } from '../database/firebase.module';

// @Module({
//   providers: [WebsocketGateway],
//   imports: [forwardRef(() => FirebaseModule), forwardRef(() => MessagesModule)],
//   exports: [WebsocketGateway],
// })
// export class WebsocketModule {}
