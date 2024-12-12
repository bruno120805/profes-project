import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { DifficultyEnum } from '../enums/difficulty.enum';
import { RatingEnum } from '../enums/rating.enum';

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

  @IsEnum(RatingEnum)
  rating: RatingEnum;

  @IsEnum(DifficultyEnum)
  difficulty: DifficultyEnum;

  @IsBoolean()
  wouldRetake: boolean;
}
