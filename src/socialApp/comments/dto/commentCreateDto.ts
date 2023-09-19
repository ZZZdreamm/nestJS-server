import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

export class CommentCreateDto {
  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Comment should have PostId field!' })
  PostId: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Comment should have UserId field!' })
  UserId: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Comment should have TextContent field!' })
  TextContent: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Comment should have Date field!' })
  Date: number;
}
