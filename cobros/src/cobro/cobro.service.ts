import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCobroDto } from './dto/create-cobro.dto';
import { UpdateCobroDto } from './dto/update-cobro.dto';
import { Cobro } from '../entities/cobro.entity';
import { Repository } from 'typeorm';
import { Orden } from '../entities/orden.entity';

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
    });
    if (!orden) throw new NotFoundException('Orden no encontrada');

    const cobro = this.cobroRepository.create({
      orden, // instancia completa
      estado: createCobroDto.estado,
      metodo_pago: createCobroDto.metodo_pago,
    });

    return this.cobroRepository.save(cobro);
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
