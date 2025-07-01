import { BaseEntity } from 'common/entities/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Orden } from './orden.entity';
import { OrdenEnum } from 'src/enums/orden.enum';

@Entity()
export class Cobro extends BaseEntity {
  @OneToOne(() => Orden)
  @JoinColumn()
  orden: Orden;

  @Column({ type: 'enum', enum: OrdenEnum, default: OrdenEnum.PENDIENTE })
  estado: OrdenEnum;

  @Column({ type: 'text' })
  metodo_pago: string;
}
