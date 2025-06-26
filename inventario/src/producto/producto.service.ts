import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from '../entities/producto.entity';
import { Inventario } from '../entities/inventario.entity';
import { InventarioEnum } from '../enums/inventario.enum';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
  ) {}

  create(createProductoDto: CreateProductoDto) {
    const producto = this.productoRepository.create(createProductoDto);
    return this.productoRepository.save(producto);
  }

  async findAll() {
    const productos = await this.productoRepository.find({
      relations: ['inventarios'],
    });
    return productos.map((producto) => {
      const { inventarios, ...rest } = producto;
      return {
        ...rest,
        stock: this.calcularStock(inventarios),
      };
    });
  }

  async findOne(id: string) {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['inventarios'],
    });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    const { inventarios, ...rest } = producto;
    return {
      ...rest,
      stock: this.calcularStock(inventarios),
    };
  }

  private calcularStock(inventarios: Inventario[]): number {
    let stock = 0;
    for (const inv of inventarios) {
      if (inv.tipo === InventarioEnum.ENTRADA) {
        stock += inv.cantidad;
      } else if (inv.tipo === InventarioEnum.SALIDA) {
        stock -= inv.cantidad;
      }
    }
    return stock;
  }

  async update(id: string, updateProductoDto: UpdateProductoDto) {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    Object.assign(producto, updateProductoDto);
    return this.productoRepository.save(producto);
  }

  async remove(id: string) {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    await this.productoRepository.softRemove(producto);
    return { deleted: true };
  }
}
