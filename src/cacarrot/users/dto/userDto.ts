import { Column } from 'typeorm';
import { UserCredentials } from './userCredentials';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

type UserDtoAtrributes = Omit<User, 'Password'>;

export class UserDto implements UserDtoAtrributes {
  @Column()
  @ApiProperty()
  Id: string;

  @Column()
  @ApiProperty()
  Email: string;
}
