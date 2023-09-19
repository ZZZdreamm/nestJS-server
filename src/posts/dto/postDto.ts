import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { PostAttributes } from '../entities/post.entity';

interface PostDtoAttributes extends Omit<PostAttributes, 'Id' | 'AutorId'> {
  AutorProfileImage: string;
  AutorName: string;
}

export class PostDto implements PostDtoAttributes {
  @Column()
  @ApiProperty()
  AutorName: string;

  @Column()
  @ApiProperty()
  Date: number;

  @Column()
  @ApiProperty()
  MediaFiles: string[];

  @Column()
  @ApiProperty()
  Text: string;

  @Column()
  @ApiProperty()
  AmountOfLikes: number;

  @Column()
  @ApiProperty()
  AmountOfComments: number;

  @Column()
  @ApiProperty()
  AutorProfileImage: string;
}
