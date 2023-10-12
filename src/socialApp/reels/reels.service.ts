import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { FirebaseService } from '../database/firebase.service';
import { ReelsCreationDto } from './dto/reelsCreationDto';
import { ReelsDto } from './dto/reelsDto';
import * as schedule from 'node-schedule';
import { storeFileInStorage } from '../storage/storeIn';
import { ProfilesService } from '../profiles/profiles.service';
import { Reels } from './entities/reels.entity';

@Injectable()
export class ReelsService {
  constructor(
    @Inject(forwardRef(() => FirebaseService))
    private readonly firebaseService: FirebaseService,
    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,
  ) {}

  async create(
    reelsCreationDto: ReelsCreationDto,
    mediaFile: Express.Multer.File,
  ) {
    reelsCreationDto.CreationTime = Number(reelsCreationDto.CreationTime);
    reelsCreationDto.ExpirationTime = Number(reelsCreationDto.ExpirationTime);
    const reelsCollection = this.firebaseService
      .getFirestore()
      .collection('Reels');
    let reels: ReelsDto;
    const mediaFileUrl = await storeFileInStorage(
      mediaFile,
      this.firebaseService,
    );
    const firebaseDocument = await reelsCollection.add({
      ...reelsCreationDto,
      MediaFile: mediaFileUrl,
    });

    const autor = await this.profilesService.getProfile(
      reelsCreationDto.AutorId,
    );
    reels = {
      Id: firebaseDocument.id,
      AutorId: autor.Id,
      AutorName: autor.Email,
      AutorProfileImage: autor.ProfileImage,
      MediaFile: mediaFileUrl,
      CreationTime: new Date(reelsCreationDto.CreationTime),
      ExpirationTime: new Date(
        reelsCreationDto.ExpirationTime + reelsCreationDto.CreationTime,
      ),
    };

    const articleSubmissionDate =
      reelsCreationDto.CreationTime + reelsCreationDto.ExpirationTime;

    const job = schedule.scheduleJob(articleSubmissionDate, async function () {
      await reelsCollection.doc(reels.Id).delete();
    });

    return reels;
  }

  async getMany(lastFetchedReelsDate: number, amount: number) {
    const reelsCollection = this.firebaseService
      .getFirestore()
      .collection('Reels');
    const reels = await reelsCollection
      .orderBy('CreationTime', 'desc')
      .startAfter(lastFetchedReelsDate || '')
      .limit(amount)
      .get();

    const promises = reels.docs.map(async (doc) => {
      const { AutorId, ...restOfReelData } = doc.data();
      const autor = await this.profilesService.getProfile(AutorId);
      return {
        Id: doc.id,
        AutorId: autor.Id,
        AutorName: autor.Email,
        AutorProfileImage: autor.ProfileImage,
        ...restOfReelData,
      };
    });
    const reelsList = await Promise.all(promises);
    return reelsList;
  }

  async getManyAutorsReelsByIds(autorsIds: string[]) {
    const promises = autorsIds.map(async (autorId) => {
      const reels = await this.getManyByAutorId(autorId);
      usersToReels[autorId] = reels;
    });
    const usersToReels = await Promise.all(promises);
    console.log(usersToReels)
    return usersToReels;
  }

  async getManyByAutorId(autorId: string) {
    const reelsCollection = this.firebaseService
      .getFirestore()
      .collection('Reels');
    const reels = await reelsCollection.where('AutorId', '==', autorId).get();
    const promises = reels.docs.map(async (doc) => {
      const { AutorId, ...restOfReelData } = doc.data();
      const autor = await this.profilesService.getProfile(AutorId);
      return {
        Id: doc.id,
        AutorId: autor.Id,
        AutorName: autor.Email,
        AutorProfileImage: autor.ProfileImage,
        ...restOfReelData,
      };
    });
    const reelsList = await Promise.all(promises);
    return reelsList;
  }

  private groupByAutors(reels: Reels[]) {
    const reelsGroupedByAutors = reels.reduce((acc, reel) => {
      if (!acc[reel.AutorId]) {
        acc[reel.AutorId] = [];
      }
      acc[reel.AutorId].push(reel);
      return acc;
    }, {});
    return reelsGroupedByAutors;
  }

  async getOne(id: string) {
    const reelsCollection = this.firebaseService
      .getFirestore()
      .collection('Reels');
    const reels = await reelsCollection.doc(id).get();
    return { Id: reels.id, ...reels.data() };
  }
}
