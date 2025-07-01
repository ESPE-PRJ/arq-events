/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Despacho } from '../entities/despacho.entity';
import { CreateDespachoDto } from './dto/create-despacho.dto';
import { UpdateDespachoDto } from './dto/update-despacho.dto';
import { Repository } from 'typeorm';
import { Orden } from '../entities/orden.entity';
import { Logger } from '@nestjs/common';
import { publishEvent } from 'src/events/rabbitmq.service';
import { DespachoEnum } from 'src/enums/despacho.enum';
@Injectable()
export class DespachoService {
  // Logger para registrar eventos y errores
  private readonly logger = new Logger(DespachoService.name);
  private eventosPendientes: Map<string, { stock?: boolean; pago?: boolean }> =
    new Map();
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

  async handleOrdenEvent(routingKey: string, payload: any): Promise<void> {
    const ordenId = payload?.ordenId;
    if (!ordenId) {
      this.logger.warn(`⚠️ Evento sin ordenId: ${routingKey}`);
      return;
    }

    const estado = this.eventosPendientes.get(ordenId) || {};

    if (routingKey === 'orden.stock-descontado') {
      estado.stock = true;
    }

    if (routingKey === 'orden.pagada') {
      estado.pago = true;
    }

    this.eventosPendientes.set(ordenId, estado);

    if (estado.stock && estado.pago) {
      try {
        const orden = await this.ordenRepo.findOne({ where: { id: ordenId } });
        if (!orden) {
          this.logger.warn(
            `⚠️ Orden ${ordenId} no encontrada al crear despacho`,
          );
          return;
        }

        const despacho = this.despachoRepo.create({
          orden,
          estado: DespachoEnum.EN_PREPARACION,
          fecha_preparacion: new Date(),
        });

        await this.despachoRepo.save(despacho);

        this.logger.log(`✅ Despacho creado para orden ${ordenId}`);

        publishEvent('orden.lista-para-despacho', {
          ordenId,
          despachoId: despacho.id,
          fecha_preparacion: despacho.fecha_preparacion,
        });

        this.eventosPendientes.delete(ordenId);
      } catch (err) {
        this.logger.error(
          `❌ Error al crear despacho para orden ${ordenId}`,
          err,
        );
      }
    } else {
      this.logger.debug(
        `📥 Evento recibido para orden ${ordenId}. Estado parcial: ${JSON.stringify(estado)}`,
      );
    }
  }
}
