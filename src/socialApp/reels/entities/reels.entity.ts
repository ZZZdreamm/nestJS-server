import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export interface ReelsAttributes {
  Id: string;
  MediaFile: string;
  CreationTime: number;
  ExpirationTime: number;
  AutorId: string;
}

@Entity()
export class Reels implements ReelsAttributes {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  Id: string;

  @Column()
  @ApiProperty()
  MediaFile: string;

  @Column()
  @ApiProperty()
  CreationTime: number;

  @Column()
  @ApiProperty()
  ExpirationTime: number;

  @Column()
  @ApiProperty()
  AutorId: string;
}
