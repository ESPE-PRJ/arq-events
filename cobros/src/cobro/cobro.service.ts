/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCobroDto } from './dto/create-cobro.dto';
import { UpdateCobroDto } from './dto/update-cobro.dto';
import { Cobro } from '../entities/cobro.entity';
import { Repository } from 'typeorm';
import { Orden } from '../entities/orden.entity';
import { publishEvent } from 'src/events/rabbitmq.service';
import { CobroEnum } from '../enums/cobro.enum';
@Injectable()
export class CobroService {
  constructor(
    @InjectRepository(Cobro)
    private readonly cobroRepository: Repository<Cobro>,
    @InjectRepository(Orden)
    private readonly ordenRepository: Repository<Orden>,
  ) {}

  async create(createCobroDto: CreateCobroDto) {
    const orden = await this.ordenRepository.findOne({
      where: { id: createCobroDto.orden_id },
      relations: ['cliente'],
    });

    if (!orden) throw new NotFoundException('Orden no encontrada');

    const cobro = this.cobroRepository.create({
      orden,
      estado: createCobroDto.estado,
      metodo_pago: createCobroDto.metodo_pago,
    });

    const savedCobro = await this.cobroRepository.save(cobro);

    // Si el estado del cobro es PAGADO, emitir el evento
    if (createCobroDto.estado === CobroEnum.PAGADO) {
      publishEvent('orden.pagada', {
        ordenId: orden.id,
        clienteId: orden.cliente?.id ?? null,
        metodoPago: createCobroDto.metodo_pago,
        cobroId: savedCobro.id,
      });
    }

    return savedCobro;
  }

  findAll() {
    // Puedes agregar relaciones si quieres traer la orden asociada
    return this.cobroRepository.find({ relations: ['orden'] });
  }

  async findOne(id: string) {
    const cobro = await this.cobroRepository.findOne({ where: { id } });
    if (!cobro) throw new NotFoundException('Cobro no encontrado');
    return cobro;
  }

  async update(id: string, updateCobroDto: UpdateCobroDto) {
    const cobro = await this.cobroRepository.findOne({ where: { id } });
    if (!cobro) throw new NotFoundException('Cobro no encontrado');
    Object.assign(cobro, updateCobroDto);
    return this.cobroRepository.save(cobro);
  }

  async remove(id: string) {
    const cobro = await this.cobroRepository.findOne({ where: { id } });
    if (!cobro) throw new NotFoundException('Cobro no encontrado');
    await this.cobroRepository.softRemove(cobro);
    return { deleted: true };
  }
}
