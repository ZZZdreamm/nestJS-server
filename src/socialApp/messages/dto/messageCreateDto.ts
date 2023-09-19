import { Column } from 'typeorm';
import { MessageResponseDto } from './messageResponseDto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class MessageCreateDto {
  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Message should have Email field!' })
  SenderId: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Message should have Email field!' })
  ReceiverId: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Message should have Email field!' })
  SenderName: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty({ message: 'Message should have Email field!' })
  Date: number;

  @Column()
  @ApiProperty()
  @IsOptional()
  TextContent?: string;

  @Column()
  @ApiProperty()
  @IsOptional()
  MediaFiles?: string[];

  @Column()
  @ApiProperty()
  @IsOptional()
  VoiceFile?: string;

  @Column()
  @ApiProperty()
  @IsOptional()
  responseTo?: MessageResponseDto;
}
