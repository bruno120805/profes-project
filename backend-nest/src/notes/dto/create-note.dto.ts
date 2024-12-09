import { IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  subject: string;

  @IsString()
  title: string;

  @IsString()
  content: string;
}
