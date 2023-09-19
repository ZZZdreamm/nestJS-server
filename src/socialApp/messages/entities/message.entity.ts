import { MessageResponseDto } from '../dto/messageResponseDto';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export interface MessageAttributes {
  Id: string;
  SenderId: string;
  SenderName: string;
  ReceiverId: string;
  TextContent: string;
  MediaFiles: string[];
  VoiceFile: string;
  Date: number;
  Emojis: string[];
  AmountOfEmojis: number;
  ResponseTo: MessageResponseDto;
}


@Entity()
export class Message implements MessageAttributes {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  Id: string;

  @Column()
  @ApiProperty()
  SenderId: string;

  @Column()
  @ApiProperty()
  SenderName: string;

  @Column()
  @ApiProperty()
  ReceiverId: string;

  @Column()
  @ApiProperty()
  TextContent: string;

  @Column()
  @ApiProperty()
  MediaFiles: string[];

  @Column()
  @ApiProperty()
  VoiceFile: string;

  @Column()
  @ApiProperty()
  Date: number;

  @Column()
  @ApiProperty()
  Emojis: string[];

  @Column()
  @ApiProperty()
  AmountOfEmojis: number;

  @Column()
  @ApiProperty()
  ResponseTo: MessageResponseDto;
}
