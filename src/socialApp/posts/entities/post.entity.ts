import { ApiProperty } from "@nestjs/swagger";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export interface PostAttributes {
  Id: string;
  AutorId: string;
  Date: number;
  MediaFiles: string[];
  Text: string;
  AmountOfLikes: number;
  AmountOfComments: number;
}

export class Post implements PostAttributes {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  Id: string;

  @Column()
  @ApiProperty()
  AutorId: string;

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
}
