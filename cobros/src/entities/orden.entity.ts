/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BaseEntity } from 'common/entities/base.entity';
import { OrdenEnum } from 'src/enums/orden.enum';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Cliente } from './cliente.entity';
import { OrdenItem } from './orden-item.entity';

@Entity()
export class Orden extends BaseEntity {
  @ManyToOne(() => Cliente, (cliente) => cliente.ordenes)
  cliente: Cliente;

  @Column({ type: 'enum', enum: OrdenEnum, default: OrdenEnum.PENDIENTE })
  estado: OrdenEnum;

  @Column({ type: 'float' })
  total: number;

  @OneToMany(() => OrdenItem, (ordenItem) => ordenItem.orden)
  orden_items: OrdenItem[];
}
