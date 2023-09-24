import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export interface ProfileAttributes {
  Id: string;
  Email: string;
  Password: string;
  ProfileImage?: string;
  Roles?: string[];
}

@Entity()
export class Profile implements ProfileAttributes {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  Id: string;

  @Column()
  @ApiProperty()
  Email: string;

  @Column()
  @ApiProperty()
  Password: string;

  @Column()
  @ApiProperty()
  @Optional()
  ProfileImage?: string;

  @Column()
  @ApiProperty()
  @Optional()
  Roles?: string[];
}
