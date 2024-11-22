import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @IsPositive()
  @Max(10)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
