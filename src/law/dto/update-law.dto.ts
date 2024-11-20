import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateLawDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  pdfs?: string[];
}
