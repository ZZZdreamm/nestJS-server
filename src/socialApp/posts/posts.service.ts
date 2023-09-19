import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PostDto } from './dto/postDto';
import { PostCreateDto } from './dto/postCreateDto';
import { UpdatePostDto } from './dto/updatePostDto';
import { ProfilesService } from '../profiles/profiles.service';
import { FirebaseService } from '../database/firebase.service';

@Injectable()
export class PostsService {
  constructor(
    @Inject(forwardRef(() => FirebaseService))
    private readonly firebaseService: FirebaseService,
    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,
  ) {}

  async create(post: PostCreateDto) {
    const fullPost = {
      AmountOfComments: 0,
      AmountOfLikes: 0,
      ...post,
    };
    const postsCollection = this.firebaseService.getFirestore().collection('Posts');
    const newPost = await postsCollection.add(fullPost);
    const autorImage = await this.profilesService.getUserImage(post.AutorName);
    return { Id: newPost.id, AutorProfileImage: autorImage, ...fullPost };
  }

  async getSomeNewest(numberOfPosts: number) {
    const postsCollection = this.firebaseService.getFirestore().collection('Posts');

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

  async likePost(postId: string, userId: string) {
    const postRef = this.firebaseService.getFirestore().collection('Posts').doc(postId);
    const ifAlreadyLiked = await postRef
      .collection('Likes')
      .where('UserId', '==', userId)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          return true;
        }
      });
    if (ifAlreadyLiked) return false;
    await postRef.collection('Likes').add({ UserId: userId });
    await postRef.get().then(async (doc) => {
      const likes = await doc.data()?.AmountOfLikes;
      await postRef.update({
        AmountOfLikes: likes + 1,
      });
    });
    return true;
  }

  async removeLike(postId: string, userId: string) {
    const postRef = this.firebaseService.getFirestore().collection('Posts').doc(postId);
    let deleted = false;
    const docs = await postRef
      .collection('Likes')
      .where('UserId', '==', userId)
      .get();
    docs.forEach((doc) => {
      doc.ref.delete();
      deleted = true;
    });
    return deleted;
  }

  async ifUserLiked(postId: string, userId: string) {
    const likesRef = this.firebaseService.getFirestore()
      .collection('Posts')
      .doc(postId)
      .collection('Likes');
    let liked = false;
    const docs = await likesRef.where('UserId', '==', userId).get();
    docs.forEach((doc) => {
      const data = doc.data();
      if (data.UserId == userId) {
        liked = true;
      }
    });

    return liked;
  }

  async getPostsOfUser(username: string, numberOfPosts: number) {
    const postsRef = this.firebaseService.getFirestore().collection('Posts');
    const query = postsRef
      .where('AutorName', '==', username)
      .limit(numberOfPosts);
    let posts: PostDto[] = [];
    const querySnapshot = await query.orderBy('Date', 'desc').get();

    const promises = querySnapshot.docs.map(async (doc) => {
      const docData = doc.data();
      const autor = await this.profilesService.getProfile(docData.AutorId);
      let post: PostDto = {
        AutorProfileImage: autor.ProfileImage,
        AutorName: autor.Email,
        Date: docData.Date,
        MediaFiles: docData.MediaFiles,
        Text: docData.Text,
        AmountOfLikes: docData.AmountOfLikes,
        AmountOfComments: docData.AmountOfComments,
      };
      return post;
    });
    posts = await Promise.all(promises);

    return posts;
  }

  async deletePost(postId: string) {
    try {
      const postRef = this.firebaseService.getFirestore().collection('Posts').doc(postId);
      await postRef.delete();
    } catch (err) {
      return 'error';
    }
    return 'success';
  }

  async updatePost(post: UpdatePostDto) {
    try {
      const postRef = this.firebaseService.getFirestore().collection('Posts').doc(post.Id);
      await postRef.update({
        TextContent: post.TextContent,
        MediaFiles: post.MediaFiles,
      });
    } catch (err) {
      return 'error';
    }
    return 'success';
  }
}
