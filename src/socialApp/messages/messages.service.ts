import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { MessageCreateDto } from './dto/messageCreateDto';
import { MessageDto } from './dto/messageDto';
import { FirebaseService } from '../database/firebase.service';

@Injectable()
export class MessagesService {
  constructor(
    @Inject(forwardRef(() => FirebaseService))
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(message: MessageCreateDto) {
    const usersFireStore = this.firebaseService
      .getFirestore()
      .collection('Users');
    if (
      message.MediaFiles.length <= 0 &&
      !message.TextContent &&
      !message.VoiceFile
    ) {
      const likeURL = `https://firebasestorage.googleapis.com/v0/b/facebugserver.appspot.com/o/usefulImages%2Flike.png?alt=media&token=5c145cfb-8601-4206-9142-5d79fbb3d8c0/like.png`;
      message = {
        ...message,
        MediaFiles: [likeURL],
      };
    }
    let createdMessage: any;
    await usersFireStore
      .doc(message.SenderId)
      .collection('Messages')
      .doc(message.ReceiverId)
      .collection('Messages')
      .add(message)
      .then((docRef) => {
        createdMessage = {
          ...message,
          Id: docRef.id,
        };
      });
    await usersFireStore
      .doc(message.ReceiverId)
      .collection('Messages')
      .doc(message.SenderId)
      .collection('Messages')
      .doc(createdMessage?.Id)
      .set(message);
    return createdMessage;
  }

  async getMessage(userId: string, friendId: string, messageId: string) {
    const usersFireStore = this.firebaseService
      .getFirestore()
      .collection('Users');
    const query = usersFireStore
      .doc(userId)
      .collection('Messages')
      .doc(friendId)
      .collection('Messages');
    const snapshot = await query.doc(messageId).get();
    const message = {
      Id: snapshot.id,
      ...snapshot.data(),
    };
    return message;
  }

  async getChatMessages(
    userId: string,
    friendId: string,
    lastMessageDate: number,
    amount: number,
  ) {
    const usersFireStore = this.firebaseService
      .getFirestore()
      .collection('Users');
    const query = usersFireStore
      .doc(userId)
      .collection('Messages')
      .doc(friendId)
      .collection('Messages');
    let messages;
    await query
      .orderBy('Date', 'desc')
      .startAfter(lastMessageDate || '')
      .limit(amount)
      .get()
      .then(async (querySnapshot: any) => {
        const promises = querySnapshot.docs.map(async (doc: any) => {
          let message = {
            ...doc.data(),
            Id: doc.id,
          };
          return message;
        });
        messages = await Promise.all(promises);
      });

    return messages;
  }

  async delete(userId: string, friendId: string, messageId: string) {
    const usersFireStore = this.firebaseService
      .getFirestore()
      .collection('Users');
    await usersFireStore
      .doc(userId)
      .collection('Messages')
      .doc(friendId)
      .collection('Messages')
      .doc(messageId)
      .delete();
    await usersFireStore
      .doc(friendId)
      .collection('Messages')
      .doc(userId)
      .collection('Messages')
      .doc(messageId)
      .delete();
  }

  async getAllMessagesToMessageWithId(
    userId: string,
    friendId: string,
    messageId: string,
  ) {
    const usersFireStore = this.firebaseService
      .getFirestore()
      .collection('Users');
    const query = usersFireStore
      .doc(userId)
      .collection('Messages')
      .doc(friendId)
      .collection('Messages');
    let allMessages = [];
    let messagesBefore: MessageDto[] = [];
    let messageToGet: MessageDto;
    let messagesAfter: MessageDto[] = [];
    await query
      .doc(messageId)
      .get()
      .then(async (doc: any) => {
        messageToGet = {
          ...doc.data(),
          Id: doc.id,
        };
      });
    try {
      await query
        .orderBy('Date', 'desc')
        .endBefore(messageToGet.Date)
        .get()
        .then(async (querySnapshot: any) => {
          let promisesBefore = querySnapshot.docs.map(async (doc: any) => {
            let message: any = {
              ...doc.data(),
              Id: doc.id,
            };
            if (message.Date > messageToGet.Date) {
              return message;
            }
          });

          messagesBefore = await Promise.all(promisesBefore);
          messagesBefore = messagesBefore.filter((message) => {
            if (message) {
              return message;
            }
          });
        });
    
      allMessages.push(...messagesBefore);
      allMessages.push(messageToGet);
    } catch {}

    return allMessages;
  }
}
