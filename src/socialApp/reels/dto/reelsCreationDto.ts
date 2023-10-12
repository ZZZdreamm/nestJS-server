import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { ReelsAttributes } from '../entities/reels.entity';
import { IsNotEmpty } from 'class-validator';

export interface ReelsCreationDtoAttributes
  extends Omit<ReelsAttributes, 'Id' | "MediaFile"> {}

export class ReelsCreationDto implements ReelsCreationDtoAttributes {
//   @Column()
//   @ApiProperty()
//   @IsNotEmpty({ message: 'Reels should have MediaFile field!' })
//   MediaFile: File;

  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Reels should have CreationTime field!' })
  CreationTime: number;

  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Reels should have ExpirationTime field!' })
  ExpirationTime: number;

  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Reels should have AutorId field!' })
  AutorId: string;
}
