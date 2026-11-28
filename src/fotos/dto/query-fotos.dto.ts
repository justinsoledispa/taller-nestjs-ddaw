import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class QueryFotosDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'min debe ser un número' })
  @Min(0, { message: 'min no puede ser menor que 0' })
  @Max(5, { message: 'min no puede ser mayor que 5' })
  min = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'max debe ser un número' })
  @Min(0, { message: 'max no puede ser menor que 0' })
  @Max(5, { message: 'max no puede ser mayor que 5' })
  max = 5;

  @IsOptional()
  @IsString({ message: 'q debe ser texto' })
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page debe ser un número entero' })
  @Min(1, { message: 'page debe ser al menos 1' })
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit debe ser un número entero' })
  @Min(1, { message: 'limit debe ser al menos 1' })
  @Max(50, { message: 'limit no puede superar 50' })
  limit = 10;

  @IsOptional()
  @IsString({ message: 'etiqueta debe ser texto' })
  etiqueta?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'orden debe ser "asc" o "desc"' })
  orden?: 'asc' | 'desc';
}
