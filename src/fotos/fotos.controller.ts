import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';

import { FotosService } from './fotos.service.js';
import { CreateFotoDto } from './dto/create-foto.dto.js';
import { QueryFotosDto } from './dto/query-fotos.dto.js';
import { UpdateFotoDto } from './dto/update-foto.dto.js';

@Controller('fotos')
export class FotosController {
  constructor(private readonly fotosService: FotosService) {}

  @Get()
  findAll(@Query() filtro: QueryFotosDto) {
    return this.fotosService.findAll(filtro);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fotosService.findOne(id);
  }

  @Post()
  create(@Body() datos: CreateFotoDto) {
    return this.fotosService.create(datos);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() datos: UpdateFotoDto) {
    return this.fotosService.update(id, datos);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fotosService.remove(id);
  }
}
