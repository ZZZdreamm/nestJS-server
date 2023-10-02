import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CommentCreateDto } from './dto/commentCreateDto';
import { CommentDto } from './dto/commentDto';
import { ProfilesService } from '../profiles/profiles.service';
import { FirebaseService } from '../database/firebase.service';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,
    @Inject(forwardRef(() => FirebaseService))
    private readonly firebaseService: FirebaseService,
  ) {}
  async create(commentCreateDto: CommentCreateDto): Promise<CommentDto> {
    const { PostId, ...comment } = commentCreateDto;
    const postRef = this.firebaseService
      .getFirestore()
      .collection('Posts')
      .doc(PostId);
    const commentsRef = postRef.collection('Comments');
    const postDoc = await postRef.get();
    await postRef.update({
      AmountOfComments: postDoc.data()?.AmountOfComments + 1,
    });
    const commentDoc = await commentsRef.add(comment);
    const user = await this.profilesService.getProfile(comment.UserId);
    const commentDto = {
      Id: commentDoc.id,
      AutorName: user.Email,
      AutorProfileImage: user.ProfileImage,
      PostId: PostId,
      TextContent: comment.TextContent,
      Date: comment.Date,
    };
    return commentDto;
  }

  async getSomeNewest(postId: string, lastCommentDate: number, amount: number) {
    const commentsRef = this.firebaseService
      .getFirestore()
      .collection('Posts')
      .doc(postId)
      .collection('Comments')
      .orderBy('Date', 'desc')
      .startAfter(lastCommentDate || '')
      .limit(amount);
    const commentsDocs = (await commentsRef.get()).docs;
    let comments: CommentDto[] = [];
    const promises = commentsDocs.map(async (doc) => {
      const docData = doc.data();
      const autor = await this.profilesService.getProfile(docData.UserId);
      const comment: CommentDto = {
        Id: doc.id,
        AutorProfileImage: autor.ProfileImage,
        Date: docData.Date,
        TextContent: docData.TextContent,
        AutorName: autor.Email,
      };
      return comment;
    });
    comments = await Promise.all(promises);
    return comments;
  }
}
