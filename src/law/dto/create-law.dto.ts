import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLawDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  tema?: string; // Nueva propiedad para "tema"

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterestDto)
  interests?: InterestDto[];

  @IsOptional()
  @IsArray()
  articles?: Array<{ article: number; summary: string }>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LawPDFDto)
  pdfs?: LawPDFDto[];
}

class InterestDto {
  @IsString()
  name: string;

  @IsString()
  summary: string;
}

class LawPDFDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  url?: string;
}
