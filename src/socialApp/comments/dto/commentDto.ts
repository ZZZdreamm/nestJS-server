import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

export class CommentDto {
  @Column()
  @ApiProperty()
  Id: string;

  @Column()
  @ApiProperty()
  AutorName: string;

  @Column()
  @ApiProperty()
  TextContent: string;

  @Column()
  @ApiProperty()
  AutorProfileImage: string;

  @Column()
  @ApiProperty()
  Date: number;
}
