import { IsString } from 'class-validator';

export class CreateProffessorDto {
  @IsString()
  name: string;

  @IsString({ each: true })
  subject: string[];
}
