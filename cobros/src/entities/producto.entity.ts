import { BaseEntity } from 'common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Inventario } from './inventario.entity';
import { OrdenItem } from './orden-item.entity';

@Entity()
export class Producto extends BaseEntity {
  @Column({ type: 'text' })
  codigo: string;

  @Column({ type: 'text' })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'float' })
  precio: number;

  @OneToMany(() => Inventario, (inventario) => inventario.producto)
  inventarios: Inventario[];

  @OneToMany(() => OrdenItem, (ordenItem) => ordenItem.producto)
  orden_items: OrdenItem[];
}
