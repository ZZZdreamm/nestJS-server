import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { Post } from './entities/post.entity';
import { PostDto } from './dto/postDto';
import { ProfilesService } from 'src/profiles/profiles.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,
  ) {}
  async getSomeNewest(numberOfPosts: number) {
    console.log(numberOfPosts);
    const postsCollection = this.firebase.firestore.collection('Posts');

    const query = postsCollection.limit(numberOfPosts);
    let posts: PostDto[] = [];
    await query
      .orderBy('Date', 'desc')
      .get()
      .then(async (querySnapshot: any) => {
        const promises = querySnapshot.docs.map(async (doc: any) => {
          const autorImage = await this.profilesService.getUserImage(
            doc.data().AutorName,
          );
          let post = {
            ...doc.data(),
            Id: doc.id,
            AutorProfileImage: autorImage || '',
          };
          return post;
        });
        posts = await Promise.all(promises);
      });
    return posts;
  }
}
