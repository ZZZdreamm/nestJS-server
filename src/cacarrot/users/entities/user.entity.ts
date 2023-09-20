import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export interface UserAttributes {
  Id: string;
  Email: string;
  Password: string;
}

export class User implements UserAttributes {
  @Column()
  @ApiProperty()
  Id: string;

  @Column()
  @ApiProperty()
  Email: string;

  @Column()
  @ApiProperty()
  Password: string;
}
