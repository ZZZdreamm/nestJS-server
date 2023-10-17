import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export interface ReelsDtoAttributes {
  Id: string;
  MediaFile: string;
  CreationTime: Date;
  ExpirationTime: Date;
  AutorId: string;
  AutorName: string;
  AutorProfileImage: string;
}

export class ReelsDto implements ReelsDtoAttributes {
  @Column()
  @ApiProperty()
  Id: string;

  @Column()
  @ApiProperty()
  Name: string;

  @Column()
  @ApiProperty()
  MediaFile: string;

  @Column()
  @ApiProperty()
  CreationTime: Date;

  @Column()
  @ApiProperty()
  ExpirationTime: Date;

  @Column()
  @ApiProperty()
  AutorId: string;

  @Column()
  @ApiProperty()
  AutorName: string;

  @Column()
  @ApiProperty()
  AutorProfileImage: string;
}
