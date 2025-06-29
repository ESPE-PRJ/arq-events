import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Envio } from '../entities/envio.entity';
import { Despacho } from '../entities/despacho.entity';
import { CreateEnvioDto } from './dto/create-envio.dto';
import { UpdateEnvioDto } from './dto/update-envio.dto';

@Injectable()
export class EnvioService {
  constructor(
    @InjectRepository(Envio)
    private envioRepo: Repository<Envio>,
    @InjectRepository(Despacho)
    private despachoRepo: Repository<Despacho>,
  ) {}

  async create(dto: CreateEnvioDto) {
    const despacho = await this.despachoRepo.findOne({
      where: { id: dto.despacho_id },
    });
    if (!despacho) throw new NotFoundException('Despacho no encontrado');

    const envio = this.envioRepo.create({
      despacho,
      estado: dto.estado ?? undefined,
      transportista: dto.transportista,
      numero_guia: dto.numero_guia,
      fecha_envio: dto.fecha_envio,
      fecha_entrega: dto.fecha_entrega,
    });
    return this.envioRepo.save(envio);
  }

  findAll() {
    return this.envioRepo.find({ relations: ['despacho'] });
  }

  async findOne(id: string) {
    const envio = await this.envioRepo.findOne({
      where: { id },
      relations: ['despacho'],
    });
    if (!envio) throw new NotFoundException('Envío no encontrado');
    return envio;
  }

  async update(id: string, dto: UpdateEnvioDto) {
    const envio = await this.envioRepo.findOne({
      where: { id },
      relations: ['despacho'],
    });
    if (!envio) throw new NotFoundException('Envío no encontrado');

    // Si se actualiza despacho:
    if (dto.despacho_id) {
      const despacho = await this.despachoRepo.findOne({
        where: { id: dto.despacho_id },
      });
      if (!despacho) throw new NotFoundException('Despacho no encontrado');
      envio.despacho = despacho;
    }

    Object.assign(envio, dto);
    return this.envioRepo.save(envio);
  }

  async remove(id: string) {
    const envio = await this.envioRepo.findOne({ where: { id } });
    if (!envio) throw new NotFoundException('Envío no encontrado');
    await this.envioRepo.softRemove(envio);
    return { deleted: true };
  }
}
