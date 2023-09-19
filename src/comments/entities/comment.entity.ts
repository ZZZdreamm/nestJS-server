import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

interface CommentAtributes {
  Id: string;
  UserId: string;
  Date: number;
  TextContent: string;
}
@Entity()
export class Comment implements CommentAtributes {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  Id: string;

  @Column()
  @ApiProperty()
  UserId: string;

  @Column()
  @ApiProperty()
  Date: number;

  @Column()
  @ApiProperty()
  TextContent: string;
}
