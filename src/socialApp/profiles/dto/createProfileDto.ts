import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateProfileDto {
  @Column()
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({ message: 'Profile should have Email field!' })
  Email: string;

  @Column()
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Profile should have Password field!' })
  Password: string;
}
