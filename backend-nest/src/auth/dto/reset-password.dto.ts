import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;
  @IsStrongPassword()
  newPassword: string;
  @IsString()
  token: string;
}
