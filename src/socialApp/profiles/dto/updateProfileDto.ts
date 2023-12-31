import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Profile should have Id field!' })
  Id: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Profile should have Email field!' })
  Email: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Profile should have Password field!' })
  Password: string;

  @Column()
  @ApiProperty()
  @IsOptional()
  ProfileImage: string;
}
