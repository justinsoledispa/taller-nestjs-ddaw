import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Foto } from './entities/foto.entity.js';
import { Etiqueta } from './entities/etiqueta.entity.js';
import { CreateFotoDto } from './dto/create-foto.dto.js';
import { QueryFotosDto } from './dto/query-fotos.dto.js';
import { UpdateFotoDto } from './dto/update-foto.dto.js';

@Injectable()
export class FotosService {
  constructor(
    @InjectRepository(Foto)
    private readonly fotosRepo: Repository<Foto>,
    @InjectRepository(Etiqueta)
    private readonly etiquetasRepo: Repository<Etiqueta>,
  ) {}

  async findAll({
    min,
    max,
    q,
    etiqueta,
    orden,
    page,
    limit,
  }: QueryFotosDto): Promise<{
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

    if (etiqueta?.trim()) {
      query.andWhere('etiqueta.texto = :etiqueta', {
        etiqueta: etiqueta.trim(),
      });
    }

    if (q?.trim()) {
      query.andWhere(
        '(foto.titulo ILIKE :q OR foto.descripcion ILIKE :q OR foto.fotografo ILIKE :q)',
        { q: `%${q.trim()}%` },
      );
    }

    if (orden) {
      query
        .orderBy('foto.calificacion', orden === 'asc' ? 'ASC' : 'DESC')
        .addOrderBy('foto.id', 'ASC');
    } else {
      query.orderBy('foto.id', 'ASC');
    }

    const [data, total] = await query
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

  async create({ albumId, etiquetas, ...datos }: CreateFotoDto): Promise<Foto> {
    const foto = this.fotosRepo.create({
      ...datos,
      album: albumId === undefined ? null : ({ id: albumId } as Foto['album']),
      etiquetas: await this.buscarOCrearEtiquetas(etiquetas),
    });
    const guardada = await this.fotosRepo.save(foto);
    return this.findOne(guardada.id);
  }

  async update(
    id: number,
    { albumId, etiquetas, ...datos }: UpdateFotoDto,
  ): Promise<Foto> {
    const foto = await this.fotosRepo.findOne({
      where: { id },
      relations: { album: true, etiquetas: true },
    });
    if (!foto) throw new NotFoundException(`Foto ${id} no encontrada`);

    Object.assign(foto, datos);
    if (albumId !== undefined) {
      foto.album =
        albumId === null
          ? null
          : ({ id: albumId } as NonNullable<Foto['album']>);
    }
    if (etiquetas !== undefined) {
      foto.etiquetas = await this.buscarOCrearEtiquetas(etiquetas);
    }

    await this.fotosRepo.save(foto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const foto = await this.fotosRepo.findOne({ where: { id } });
    if (!foto) throw new NotFoundException(`Foto ${id} no encontrada`);
    await this.fotosRepo.remove(foto);
  }

  private async buscarOCrearEtiquetas(
    textos: string[] = [],
  ): Promise<Etiqueta[]> {
    const limpios = [
      ...new Set(textos.map((texto) => texto.trim().toLowerCase())),
    ];
    if (limpios.length === 0) return [];

    const existentes = await this.etiquetasRepo.findBy({ texto: In(limpios) });
    const nuevas = limpios
      .filter(
        (texto) => !existentes.some((etiqueta) => etiqueta.texto === texto),
      )
      .map((texto) => this.etiquetasRepo.create({ texto }));

    return [...existentes, ...(await this.etiquetasRepo.save(nuevas))];
  }
}
