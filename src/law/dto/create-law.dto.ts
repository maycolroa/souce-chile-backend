import {
  IsString,
  IsArray,
  IsOptional,
  ValidateNested,
  IsNumber,
  IsBoolean,
} from 'class-validator';
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
  @IsString()
  tipo_norma?: string; // Nueva propiedad para "tipo_norma"

  @IsOptional()
  @IsNumber()
  numero?: number; // Nueva propiedad para "numero"

  @IsOptional()
  @IsNumber()
  año?: number; // Nueva propiedad para "año"

  @IsOptional()
  @IsString()
  descripcion_corta?: string; // Nueva propiedad para "descripcion_corta"

  @IsOptional()
  @IsString()
  ente?: string; // Nueva propiedad para "ente"

  @IsOptional()
  @IsString()
  sistema?: string; // Nueva propiedad para "sistema"

  @IsOptional()
  @IsBoolean()
  derogada?: boolean; // Nueva propiedad para "derogada"

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterestDto)
  interests?: InterestDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleDto)
  articles?: ArticleDto[];

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

class ArticleDto {
  @IsNumber()
  article: number;

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
