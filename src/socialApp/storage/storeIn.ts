import { randomUUID } from 'crypto';
import { FirebaseService } from '../database/firebase.service';

export async function storeFileInStorage(
  file: Express.Multer.File,
  firebaseService: FirebaseService,
) {
  const reelsStorage = firebaseService.getStorage().bucket();

  const lastIndex = file.originalname.lastIndexOf('.');
  const partBeforeLastDot = file.originalname.substring(0, lastIndex);

  const parts = file.originalname.split('.');
  const lastPart = parts[parts.length - 1];

  const fileUrl = `reels/${partBeforeLastDot}+${randomUUID()}.${lastPart}`;

  const imageRef = await reelsStorage.file(fileUrl).save(file.buffer);

  let url = await reelsStorage.file(fileUrl).getSignedUrl({
    action: 'read',
    expires: '03-01-2500',
  });

  return url[0];
}
