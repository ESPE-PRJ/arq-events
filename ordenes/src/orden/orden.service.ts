import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { Orden } from '../entities/orden.entity';
import { OrdenItem } from '../entities/orden-item.entity';
import { Cliente } from '../entities/cliente.entity';
import { Producto } from '../entities/producto.entity';
import { OrdenEnum } from '../enums/orden.enum';
import { InventarioEnum } from '../enums/inventario.enum';

@Injectable()
export class OrdenService {
  constructor(
    @InjectRepository(Orden)
    private readonly ordenRepository: Repository<Orden>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createOrdenDto: CreateOrdenDto) {
    // Transacción para crear la orden y sus items
    return await this.ordenRepository.manager.transaction(async (manager) => {
      // Buscar cliente usando el repositorio ya inyectado
      const cliente = await this.clienteRepository.findOne({
        where: { id: createOrdenDto.cliente_id },
      });
      if (!cliente) throw new NotFoundException('Cliente no encontrado');

      // Calcular total
      let total = 0;
      for (const item of createOrdenDto.orden_items) {
        total += item.cantidad * item.precio_unitario;
      }

      // Crear la orden
      const orden = manager.getRepository(Orden).create({
        cliente,
        estado: OrdenEnum.PENDIENTE,
        total,
      });
      await manager.getRepository(Orden).save(orden);

      // Crear los items y validar stock
      for (const item of createOrdenDto.orden_items) {
        const producto = await this.productoRepository.findOne({
          where: { id: item.id_producto },
          relations: ['inventarios'],
        });
        if (!producto)
          throw new NotFoundException(
            `Producto ${item.id_producto} no encontrado`,
          );

        // Calcular stock actual
        let stock = 0;
        for (const inv of producto.inventarios) {
          if (inv.tipo === InventarioEnum.ENTRADA) stock += inv.cantidad;
          else if (inv.tipo === InventarioEnum.SALIDA) stock -= inv.cantidad;
        }
        // Restar la cantidad solicitada
        if (stock - item.cantidad < 0) {
          throw new NotFoundException(
            `Stock insuficiente para el producto ${item.id_producto}`,
          );
        }

        const ordenItem = manager.getRepository(OrdenItem).create({
          orden,
          producto,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
        });
        await manager.getRepository(OrdenItem).save(ordenItem);
      }

      // Retornar la orden con items
      return manager.getRepository(Orden).findOne({
        where: { id: orden.id },
        relations: ['cliente', 'orden_items', 'orden_items.producto'],
      });
    });
  }

  findAll() {
    return this.ordenRepository.find({
      relations: ['cliente', 'orden_items', 'orden_items.producto'],
    });
  }

  findOne(id: string) {
    return this.ordenRepository.findOne({
      where: { id },
      relations: ['cliente', 'orden_items', 'orden_items.producto'],
    });
  }

  // async update(id: string, updateOrdenDto: UpdateOrdenDto) {
  //   const orden = await this.ordenRepository.findOne({
  //     where: { id },
  //   });
  //   if (!orden) throw new NotFoundException('Orden no encontrada');
  //   Object.assign(orden, updateOrdenDto);
  //   return this.ordenRepository.save(orden);
  // }

  async remove(id: string) {
    const orden = await this.ordenRepository.findOne({
      where: { id },
    });
    if (!orden) throw new NotFoundException('Orden no encontrada');
    await this.ordenRepository.softRemove(orden);
    return { deleted: true };
  }
}
