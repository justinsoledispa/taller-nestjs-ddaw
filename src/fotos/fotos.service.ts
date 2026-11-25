import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Foto } from './entities/foto.entity.js';

export interface FiltroFotos {
  min: number;
  max: number;
  q?: string;
  page: number;
  limit: number;
}

@Injectable()
export class FotosService {
  constructor(
    @InjectRepository(Foto)
    private readonly fotosRepo: Repository<Foto>,
  ) {}

  async findAll({ min, max, q, page, limit }: FiltroFotos): Promise<{
    data: Foto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const query = this.fotosRepo
      .createQueryBuilder('foto')
      .leftJoinAndSelect('foto.album', 'album')
      .leftJoinAndSelect('foto.etiquetas', 'etiqueta')
      .where('foto.calificacion BETWEEN :min AND :max', { min, max });

    if (q?.trim()) {
      query.andWhere(
        '(foto.titulo ILIKE :q OR foto.descripcion ILIKE :q OR foto.fotografo ILIKE :q)',
        { q: `%${q.trim()}%` },
      );
    }

    const [data, total] = await query
      .orderBy('foto.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Foto> {
    const foto = await this.fotosRepo.findOne({
      where: { id },
      relations: { album: true, etiquetas: true },
    });
    if (!foto) throw new NotFoundException(`Foto ${id} no encontrada`);
    return foto;
  }

  create(datos: Partial<Foto>): Promise<Foto> {
    const foto = this.fotosRepo.create(datos);
    return this.fotosRepo.save(foto);
  }

  async update(id: number, datos: Partial<Foto>): Promise<Foto> {
    if (Object.keys(datos).length === 0) return this.findOne(id);

    const result = await this.fotosRepo.update(id, datos);
    if (result.affected === 0) {
      throw new NotFoundException(`Foto ${id} no encontrada`);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.fotosRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Foto ${id} no encontrada`);
    }
  }
}
