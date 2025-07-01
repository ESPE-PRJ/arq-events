/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { Inventario } from '../entities/inventario.entity';
import { Producto } from '../entities/producto.entity';
import { InventarioEnum } from '../enums/inventario.enum';
import { publishEvent } from 'src/events/rabbitmq.service';
@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async handleOrdenConfirmada(payload: any) {
    const productos = payload?.productos;
    const ordenId = payload?.ordenId;

    if (!productos || !Array.isArray(productos)) {
      console.error('❌ Evento recibido con estructura inválida:', payload);
      return;
    }

    const productosProcesados: { producto_id: string; cantidad: number }[] = [];

    for (const item of productos) {
      const producto = await this.productoRepository.findOne({
        where: { id: item.producto_id },
      });

      if (!producto) {
        console.warn(`⚠️ Producto con ID ${item.producto_id} no encontrado`);
        continue;
      }

      // Calcular stock actual
      const inventarios = await this.inventarioRepository.find({
        where: { producto: { id: item.producto_id } },
      });

      let stockActual = 0;
      for (const inv of inventarios) {
        stockActual +=
          inv.tipo === InventarioEnum.ENTRADA ? inv.cantidad : -inv.cantidad;
      }

      if (stockActual < item.cantidad) {
        console.warn(
          `❌ Stock insuficiente para producto ${item.producto_id}. Actual: ${stockActual}, Requerido: ${item.cantidad}`,
        );
        continue;
      }

      // Crear movimiento de salida
      const inventario = this.inventarioRepository.create({
        producto: producto,
        tipo: InventarioEnum.SALIDA,
        cantidad: item.cantidad,
        motivo: `Salida automática por orden ${ordenId}`,
      });

      await this.inventarioRepository.save(inventario);
      productosProcesados.push(item);
    }

    console.log(
      `✅ Se procesaron ${productosProcesados.length} movimientos de inventario para la orden ${ordenId}`,
    );

    // Si se procesaron todos los productos correctamente, emitir evento
    if (productosProcesados.length === productos.length) {
      publishEvent('orden.stock-descontado', {
        ordenId,
        productos: productosProcesados,
      });
    } else {
      console.warn(
        `⚠️ Algunos productos no fueron procesados. No se emitirá evento de orden.stock-descontado`,
      );
    }
  }

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
