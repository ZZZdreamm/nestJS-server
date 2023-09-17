import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';

interface PostCreateAtributes {
  AutorId: string;
  AutorName: string;
  TextContent: string;
  MediaFiles: string[];
  Date: number;
}

export class PostCreateDto implements PostCreateAtributes {
  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Post should have AutorId field!' })
  AutorId: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Post should have AutorName field!' })
  AutorName: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Post should have Date field!' })
  Date: number;

  @Column()
  @ApiProperty()
  @IsOptional()
  TextContent: string;

  @Column()
  @ApiProperty()
  @IsOptional()
  MediaFiles: string[];
}
