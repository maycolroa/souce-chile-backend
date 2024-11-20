import { IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;
  @IsString()
  actividad_economica: string;
  @IsString()
  nit: string;
}
