import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  ParseFloatPipe,
  Post,
  Patch,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';

import { FotosService } from './fotos.service.js';
import type { FiltroFotos } from './fotos.service.js';
import type { Foto } from './entities/foto.entity.js';

@Controller('fotos')
export class FotosController {
  constructor(private readonly fotosService: FotosService) {}

  @Get()
  findAll(
    @Query('min', new DefaultValuePipe(0), ParseFloatPipe) min: number,
    @Query('max', new DefaultValuePipe(5), ParseFloatPipe) max: number,
    @Query('q', new DefaultValuePipe('')) q: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('etiqueta') etiqueta?: string,
    @Query('orden') orden?: string,
  ) {
    if (orden !== undefined && orden !== 'asc' && orden !== 'desc') {
      throw new BadRequestException('orden debe ser "asc" o "desc"');
    }

    const filtro: FiltroFotos = { min, max, q, etiqueta, orden, page, limit };
    return this.fotosService.findAll(filtro);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fotosService.findOne(id);
  }

  @Post()
  create(@Body() datos: Omit<Foto, 'id'>) {
    return this.fotosService.create(datos);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: Partial<Omit<Foto, 'id'>>,
  ) {
    return this.fotosService.update(id, datos);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fotosService.remove(id);
  }
}
