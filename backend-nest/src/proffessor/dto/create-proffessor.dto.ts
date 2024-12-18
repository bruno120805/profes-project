import { IsArray, IsString } from 'class-validator';

export class CreateProffessorDto {
  @IsString()
  name: string;

  @IsString({ each: true })
  @IsArray({ message: 'La materia debe de ser un arreglo de strings' })
  subject: string[];
}
