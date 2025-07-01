/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Envio } from '../entities/envio.entity';
import { Despacho } from '../entities/despacho.entity';
import { CreateEnvioDto } from './dto/create-envio.dto';
import { UpdateEnvioDto } from './dto/update-envio.dto';
import { publishEvent } from 'src/events/rabbitmq.service';
import { EnvioEnum } from '../enums/envio.enum';
@Injectable()
export class EnvioService {
  private readonly logger = new Logger(EnvioService.name);
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

  async handleEventoOrdenLista(routingKey: string, payload: any) {
    const ordenId = payload?.ordenId;

    if (!ordenId) {
      this.logger.warn(`⚠️ Evento ${routingKey} sin ordenId válido`);
      return;
    }

    // Buscar el despacho relacionado a la orden
    const despacho = await this.despachoRepo.findOne({
      where: { orden: { id: ordenId } },
      relations: ['orden'],
    });

    if (!despacho) {
      this.logger.warn(`⚠️ No se encontró despacho para orden ${ordenId}`);
      return;
    }

    // Crear el envío con despacho, no con orden
    const envio = this.envioRepo.create({
      despacho,
      estado: EnvioEnum.EN_CAMINO,
      fecha_envio: new Date(),
      transportista: 'Automático',
      numero_guia: `GUIA-${ordenId}`,
    });

    const saved = await this.envioRepo.save(envio);

    this.logger.log(`📦 Envío creado automáticamente para orden ${ordenId}`);

    publishEvent('envio.iniciado', {
      envioId: saved.id,
      ordenId,
      estado: saved.estado,
      fecha_envio: saved.fecha_envio,
    });
  }
}
