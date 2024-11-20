import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsString()
  @MinLength(3)
  fullName: string;

  @IsOptional() // Campo opcional
  @IsUUID() // Verifica que el valor sea un UUID
  companyId?: string;
}
