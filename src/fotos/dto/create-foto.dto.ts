import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  Matches,
} from 'class-validator';

export class CreateFotoDto {
  @IsString({ message: 'El título debe ser texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MaxLength(100, { message: 'El título no puede superar 100 caracteres' })
  titulo: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  descripcion?: string;

  @IsOptional()
  @IsString({ message: 'El nombre del fotógrafo debe ser texto' })
  @MaxLength(100, {
    message: 'El nombre del fotógrafo no puede superar 100 caracteres',
  })
  fotografo?: string;

  @IsOptional()
  @IsNumber({}, { message: 'La calificación debe ser un número' })
  @Min(0, { message: 'La calificación mínima es 0' })
  @Max(5, { message: 'La calificación máxima es 5' })
  calificacion?: number;

  @IsUrl({}, { message: 'La ruta debe ser una URL válida' })
  ruta: string;

  @IsOptional()
  @IsInt({ message: 'albumId debe ser un número entero' })
  @Min(1, { message: 'albumId debe ser mayor que 0' })
  albumId?: number;

  @IsOptional()
  @IsArray({ message: 'Las etiquetas deben enviarse como una lista' })
  @IsString({ each: true, message: 'Cada etiqueta debe ser texto' })
  @Matches(/\S/, {
    each: true,
    message: 'Las etiquetas no pueden estar vacías',
  })
  @MaxLength(30, {
    each: true,
    message: 'Cada etiqueta no puede superar 30 caracteres',
  })
  etiquetas?: string[];
}
