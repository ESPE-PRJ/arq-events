import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenService } from './orden.service';
import { OrdenController } from './orden.controller';
import { Orden } from '../entities/orden.entity';
import { OrdenItem } from '../entities/orden-item.entity';
import { Cliente } from '../entities/cliente.entity';
import { Producto } from '../entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orden, OrdenItem, Cliente, Producto])],
  controllers: [OrdenController],
  providers: [OrdenService],
})
export class OrdenModule {}
