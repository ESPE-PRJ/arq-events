import { BaseEntity } from 'common/entities/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Orden } from './orden.entity';
import { CobroEnum } from 'src/enums/cobro.enum';

@Entity()
export class Cobro extends BaseEntity {
  @OneToOne(() => Orden)
  @JoinColumn()
  orden: Orden;

  @Column({ type: 'enum', enum: CobroEnum, default: CobroEnum.PENDIENTE })
  estado: CobroEnum;

  @Column({ type: 'text' })
  metodo_pago: string;
}
