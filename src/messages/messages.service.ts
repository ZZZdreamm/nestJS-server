import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { MessageCreateDto } from './dto/messageCreateDto';
import { MessageDto } from './dto/messageDto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  async create(message: MessageCreateDto) {
    const usersFireStore = this.firebase.firestore.collection('Users');
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

  async getChatMessages(
    userId: string,
    friendId: string,
    numberOfMessages: number,
  ) {
    const usersFireStore = this.firebase.firestore.collection('Users');
    const query = usersFireStore
      .doc(userId)
      .collection('Messages')
      .doc(friendId)
      .collection('Messages')
      .limit(numberOfMessages);
    let messages;
    await query
      .orderBy('Date', 'desc')
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
    const usersFireStore = this.firebase.firestore.collection('Users');
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
    const usersFireStore = this.firebase.firestore.collection('Users');
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
      await query
        .orderBy('Date', 'desc')
        .startAt(messageToGet.Date)
        .limit(10)
        .get()
        .then(async (querySnapshot: any) => {
          let promisesAfter = querySnapshot.docs.map(async (doc: any) => {
            let message: any = {
              ...doc.data(),
              Id: doc.id,
            };
            if (message.Date < messageToGet.Date) {
              return message;
            }
          });

          messagesAfter = await Promise.all(promisesAfter);
          messagesAfter = messagesAfter.filter((message) => {
            if (message) {
              return message;
            }
          });
        });
      allMessages.push(...messagesBefore);
      allMessages.push(messageToGet);
      allMessages.push(...messagesAfter);
    } catch {}

    return allMessages;
  }
}
