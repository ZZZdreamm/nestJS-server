import { ApiProperty } from '@nestjs/swagger';
import { MessageAttributes } from '../entities/message.entity';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { MessageResponseDto } from './messageResponseDto';

interface MessageDtoAttributes extends MessageAttributes {}

export class MessageDto implements MessageDtoAttributes {
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
  TextContent?: string;

  @Column()
  @ApiProperty()
  MediaFiles?: string[];

  @Column()
  @ApiProperty()
  VoiceFile?: string;

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
  ResponseTo?: MessageResponseDto;
}
