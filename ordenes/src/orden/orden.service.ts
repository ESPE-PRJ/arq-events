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
import { publishEvent } from '../events/rabbitmq.service';

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

  async create(createOrdenDto: CreateOrdenDto): Promise<Orden> {
    return await this.ordenRepository.manager.transaction(async (manager) => {
      const cliente = await this.clienteRepository.findOne({
        where: { id: createOrdenDto.cliente_id },
      });
      if (!cliente) throw new NotFoundException('Cliente no encontrado');

      let total = 0;
      for (const item of createOrdenDto.orden_items) {
        total += item.cantidad * item.precio_unitario;
      }

      const orden = manager.getRepository(Orden).create({
        cliente,
        estado: OrdenEnum.PENDIENTE,
        total,
      });
      await manager.getRepository(Orden).save(orden);

      for (const item of createOrdenDto.orden_items) {
        const producto = await this.productoRepository.findOne({
          where: { id: item.id_producto },
          relations: ['inventarios'],
        });
        if (!producto)
          throw new NotFoundException(
            `Producto ${item.id_producto} no encontrado`,
          );

        let stock = 0;
        for (const inv of producto.inventarios) {
          if (inv.tipo === InventarioEnum.ENTRADA) stock += inv.cantidad;
          else if (inv.tipo === InventarioEnum.SALIDA) stock -= inv.cantidad;
        }

        if (stock - item.cantidad < 0) {
          throw new NotFoundException(
            `Stock insuficiente para el producto ${item.id_producto}`,
          );
        }
        //
        const ordenItem = manager.getRepository(OrdenItem).create({
          orden,
          producto,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
        });
        await manager.getRepository(OrdenItem).save(ordenItem);
      }

      const ordenCompleta = await manager.getRepository(Orden).findOne({
        where: { id: orden.id },
        relations: ['cliente', 'orden_items', 'orden_items.producto'],
      });

      if (!ordenCompleta) {
        throw new NotFoundException(
          'Error al recuperar la orden recién creada',
        );
      }
      publishEvent('orden.creada', {
        ordenId: ordenCompleta.id,
        productos: ordenCompleta.orden_items.map((item) => ({
          producto_id: item.producto.id,
          cantidad: item.cantidad,
        })),
        total: ordenCompleta.total,
        cliente: {
          id: ordenCompleta.cliente.id,
          nombre: ordenCompleta.cliente.nombre,
          correo: ordenCompleta.cliente.correo,
          direccion: ordenCompleta.cliente.direccion,
        },
      });
      return ordenCompleta;
    });
  }

  async updateOrden(id: string, updateData: Partial<Orden>): Promise<Orden> {
    const orden = await this.ordenRepository.findOne({
      where: { id },
      relations: ['orden_items', 'orden_items.producto'],
    });

    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }

    const estadoAnterior = orden.estado;

    Object.assign(orden, updateData);
    const ordenActualizada = await this.ordenRepository.save(orden);

    if (
      updateData.estado &&
      updateData.estado === OrdenEnum.PAGADO &&
      estadoAnterior !== OrdenEnum.PAGADO
    ) {
      publishEvent('orden.confirmada', {
        ordenId: orden.id,
        productos: orden.orden_items.map((item) => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
        })),
      });
    }

    return ordenActualizada;
  }

  async removeOrden(id: string): Promise<void> {
    const orden = await this.ordenRepository.findOne({ where: { id } });

    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }

    await this.ordenRepository.softDelete(id);

    publishEvent('orden.eliminada', {
      ordenId: id,
    });
  }
  findAll() {
    return this.ordenRepository.find({
      relations: ['cliente', 'orden_items', 'orden_items.producto'],
    });
  }

  async findOne(id: string): Promise<Orden> {
    const orden = await this.ordenRepository.findOne({
      where: { id },
      relations: ['cliente', 'orden_items', 'orden_items.producto'],
    });

    if (!orden) throw new NotFoundException('Orden no encontrada');
    return orden;
  }
}
