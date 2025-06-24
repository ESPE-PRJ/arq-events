import { BaseEntity } from 'common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Orden } from './orden.entity';
import { Producto } from './producto.entity';

@Entity()
export class OrdenItem extends BaseEntity {
  @ManyToOne(() => Orden, (orden) => orden.orden_items)
  orden: Orden;

  @ManyToOne(() => Producto, (producto) => producto.orden_items)
  producto: Producto;

  @Column({ type: 'int' })
  cantidad: number;

  @Column()
  precio_unitario: number;
}
