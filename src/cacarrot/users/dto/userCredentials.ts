import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { User } from '../entities/user.entity';

type UserCredentialsAttributes = Omit<User, 'Id'>;

export class UserCredentials implements UserCredentialsAttributes {
  @Column()
  @ApiProperty()
  Email: string;

  @Column()
  @ApiProperty()
  Password: string;
}
