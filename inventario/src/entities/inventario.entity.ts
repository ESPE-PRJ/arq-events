import { BaseEntity } from 'common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Producto } from './producto.entity';
import { InventarioEnum } from 'src/enums/inventario.enum';

@Entity()
export class Inventario extends BaseEntity {
  @ManyToOne(() => Producto, (producto) => producto.inventarios)
  producto: Producto;

  @Column({
    type: 'enum',
    enum: InventarioEnum,
  })
  tipo: InventarioEnum;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'text', nullable: true, default: null })
  motivo: string;
}
