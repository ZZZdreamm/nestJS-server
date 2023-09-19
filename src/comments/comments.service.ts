import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { CommentCreateDto } from './dto/commentCreateDto';
import { ProfilesService } from 'src/profiles/profiles.service';
import { CommentDto } from './dto/commentDto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,
  ) {}
  async create(commentCreateDto: CommentCreateDto) {
    const { PostId, ...comment } = commentCreateDto;
    const postRef = this.firebase.firestore.collection('Posts').doc(PostId);
    const commentsRef = postRef.collection('Comments');
    const postDoc = await postRef.get();
    await postRef.update({
      AmountOfComments: postDoc.data()?.AmountOfComments + 1,
    });
    const commentDoc = await commentsRef.add(comment);
    return {
      Id: commentDoc.id,
      ...commentCreateDto,
    };
  }

  async getSomeNewest(amount: number, postId: string) {
    const commentsRef = this.firebase.firestore
      .collection('Posts')
      .doc(postId)
      .collection('Comments');
    const commentsDocs = (await commentsRef.limit(amount).get()).docs;
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
