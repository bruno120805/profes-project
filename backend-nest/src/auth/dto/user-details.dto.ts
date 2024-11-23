import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UserDetails {
  @IsEmail()
  email: string;
  @IsString()
  displayName: string;
  @IsStrongPassword()
  @IsOptional()
  password?: string;
}
