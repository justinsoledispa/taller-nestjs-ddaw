import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FotosController } from './fotos.controller.js';
import { FotosService } from './fotos.service.js';
import { Foto } from './entities/foto.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Foto])],
  controllers: [FotosController],
  providers: [FotosService]
})
export class FotosModule {}
