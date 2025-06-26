import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { Inventario } from '../entities/inventario.entity';
import { Producto } from '../entities/producto.entity';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createInventarioDto: CreateInventarioDto) {
    const producto = await this.productoRepository.findOne({
      where: { id: createInventarioDto.producto_id },
    });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    const tipo = createInventarioDto.tipo;

    const inventario = this.inventarioRepository.create({
      producto: producto,
      tipo: tipo,
      cantidad: createInventarioDto.cantidad,
      motivo: createInventarioDto.motivo,
    });
    return this.inventarioRepository.save(inventario);
  }

  findAll() {
    return this.inventarioRepository.find({ relations: ['producto'] });
  }

  async findOne(id: string) {
    const inventario = await this.inventarioRepository.findOne({
      where: { id },
      relations: ['producto'],
    });
    if (!inventario) throw new NotFoundException('Inventario no encontrado');
    return inventario;
  }

  async update(id: string, updateInventarioDto: UpdateInventarioDto) {
    const inventario = await this.inventarioRepository.findOne({
      where: { id },
    });
    if (!inventario) throw new NotFoundException('Inventario no encontrado');
    Object.assign(inventario, updateInventarioDto);
    return this.inventarioRepository.save(inventario);
  }

  async remove(id: string) {
    const inventario = await this.inventarioRepository.findOne({
      where: { id },
    });
    if (!inventario) throw new NotFoundException('Inventario no encontrado');
    await this.inventarioRepository.softRemove(inventario);
    return { deleted: true };
  }
}
