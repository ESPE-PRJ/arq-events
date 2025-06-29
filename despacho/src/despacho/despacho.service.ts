import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Despacho } from '../entities/despacho.entity';
import { CreateDespachoDto } from './dto/create-despacho.dto';
import { UpdateDespachoDto } from './dto/update-despacho.dto';
import { Repository } from 'typeorm';
import { Orden } from '../entities/orden.entity';

@Injectable()
export class DespachoService {
  constructor(
    @InjectRepository(Despacho)
    private despachoRepo: Repository<Despacho>,
    @InjectRepository(Orden)
    private ordenRepo: Repository<Orden>,
  ) {}

  async create(dto: CreateDespachoDto) {
    const orden = await this.ordenRepo.findOne({ where: { id: dto.orden_id } });
    if (!orden) throw new NotFoundException('Orden no encontrada');

    const despacho = this.despachoRepo.create({
      orden,
      estado: dto.estado ?? undefined,
      fecha_preparacion: dto.fecha_preparacion,
      fecha_envio: dto.fecha_envio,
    });

    return this.despachoRepo.save(despacho);
  }

  findAll() {
    return this.despachoRepo.find({ relations: ['orden'] });
  }

  async findOne(id: string) {
    const despacho = await this.despachoRepo.findOne({
      where: { id },
      relations: ['orden'],
    });
    if (!despacho) throw new NotFoundException('Despacho no encontrado');
    return despacho;
  }
  async update(id: string, dto: UpdateDespachoDto) {
    const despacho = await this.despachoRepo.findOne({
      where: { id },
      relations: ['orden'],
    });
    if (!despacho) throw new NotFoundException('Despacho no encontrado');

    // Solo si quieres actualizar la orden relacionada:
    if (dto.orden_id) {
      const orden = await this.ordenRepo.findOne({
        where: { id: dto.orden_id },
      });
      if (!orden) throw new NotFoundException('Orden no encontrada');
      despacho.orden = orden;
    }

    Object.assign(despacho, dto);
    return this.despachoRepo.save(despacho);
  }

  async remove(id: string) {
    const despacho = await this.despachoRepo.findOne({ where: { id } });
    if (!despacho) throw new NotFoundException('Despacho no encontrado');
    await this.despachoRepo.softRemove(despacho);
    return { deleted: true };
  }
}
