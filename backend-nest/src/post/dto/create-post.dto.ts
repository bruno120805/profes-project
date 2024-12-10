import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString({ each: true })
  subject: string[];

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @IsString()
  schoolName: string;
}
