import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Post should have Id field!' })
  Id: string;

  @Column()
  @ApiProperty()
  @IsOptional()
  TextContent: string;

  @Column()
  @ApiProperty()
  @IsOptional()
  MediaFiles: string[];
}
