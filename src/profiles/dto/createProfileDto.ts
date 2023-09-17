import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

export class CreateProfileDto {
  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Profile should have Email field!' })
  Email: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Profile should have Password field!' })
  Password: string;
}
