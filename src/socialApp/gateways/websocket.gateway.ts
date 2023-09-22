// import {
//   ConnectedSocket,
//   MessageBody,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { MessagesService } from '../messages/messages.service';
// import { MessageCreateDto } from '../messages/dto/messageCreateDto';
// import { Inject, forwardRef } from '@nestjs/common';
// import { FirebaseService } from '../database/firebase.service';

// @WebSocketGateway({ cors: true })
// export class WebsocketGateway
//   implements OnGatewayConnection, OnGatewayDisconnect
// {
//   constructor(
//     @Inject(forwardRef(() => FirebaseService))
//     private readonly firebaseService: FirebaseService,
//     @Inject(forwardRef(() => MessagesService))
//     private readonly messagesService: MessagesService,
//   ) {}
//   @WebSocketServer()
//   private readonly server: Server;
//   private users = new Map();
//   private rooms = new Map();
//   private clientProperties = new Map<
//     string,
//     { userId: string; roomId: string; who: string }
//   >();

//   handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
//     this.users.set(client.id, client);
//     this.clientProperties.set(client.id, {
//       userId: '',
//       roomId: '',
//       who: '',
//     });
//   }

//   @SubscribeMessage('send-message')
//   async handleMessageSending(
//     @MessageBody() message: MessageCreateDto,
//     @ConnectedSocket() client: Socket,
//   ) {
//     const storedMessage = await this.messagesService.create(message);
//     client.broadcast.emit(
//       `receive-message/${message.ReceiverId}/${message.SenderId}`,
//       storedMessage,
//     );
//     client.emit(
//       `receive-message/${message.SenderId}/${message.ReceiverId}`,
//       storedMessage,
//     );
//   }

//   @SubscribeMessage('leave-call')
//   async leaveCall(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
//     client.to(data.target).emit('user-left', data.userId);
//   }

//   @SubscribeMessage('create-join-room')
//   async createJoinRoom(
//     @MessageBody() data: any,
//     @ConnectedSocket() client: Socket,
//   ) {
//     this.rooms.set(`${data.roomId}`, []);
//     client.broadcast.emit(`calling/${data.friendId}`, {
//       userId: data.myId,
//       roomId: data.roomId,
//     });
//   }

//   @SubscribeMessage('join-call')
//   async joinCall(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
//     this.clientProperties.set(client.id, {
//       userId: data.myId,
//       roomId: data.roomId,
//       who: data.who,
//     });
//     if (data.who == 'caller') {
//       client.join(`${data.roomId}`);
//       const myRoom = this.rooms.get(`${data.roomId}`);
//       if (myRoom) {
//         myRoom.push(data.myId);
//       }
//     } else {
//       client.join(`${data.roomId}`);
//       const friendRoom = this.rooms.get(`${data.roomId}`);
//       if (friendRoom) {
//         friendRoom.push(data.myId);
//       }
//     }

//     const myRoom = this.rooms.get(`${data.roomId}`);
//     if (myRoom && myRoom.length > 1) {
//       this.server.in(`${data.roomId}`).emit(`start-peering`, {});
//     }
//   }

//   @SubscribeMessage('message')
//   async handleWebRTCHandshake(
//     @MessageBody() data: any,
//     @ConnectedSocket() client: Socket,
//   ) {
//     switch (data.type) {
//       case 'video-offer':
//         client.to(data.target).emit('message', data);
//         break;
//       case 'video-answer':
//         client.to(data.target).emit('message', data);
//         break;
//       case 'iceCandidate':
//         client.to(data.target).emit('message', data);
//         break;
//       default:
//         break;
//     }
//   }

//   handleDisconnect(@ConnectedSocket() client: Socket) {
//     const clientProperties = this.clientProperties.get(client.id);
//     this.users.delete(client.id);
//     let userRoom = this.rooms.get(`${clientProperties.roomId}`);
//     if (!userRoom) return;
//     userRoom = userRoom.filter((user: any) => user !== clientProperties.userId);
//     this.rooms.set(`${clientProperties.roomId}`, userRoom);
//   }
// }
