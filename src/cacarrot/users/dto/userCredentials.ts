import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { User } from '../entities/user.entity';
import { IsNotEmpty } from 'class-validator';

type UserCredentialsAttributes = Omit<User, 'Id'>;

export class UserCredentials implements UserCredentialsAttributes {
  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Email is required' })
  Email: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  Password: string;
}
