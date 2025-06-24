import { BaseEntity } from 'common/entities/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Orden } from './orden.entity';
import { DespachoEnum } from 'src/enums/despacho.enum';

@Entity()
export class Despacho extends BaseEntity {
  @OneToOne(() => Orden)
  @JoinColumn()
  orden: Orden;

  @Column({
    type: 'enum',
    enum: DespachoEnum,
    default: DespachoEnum.PENDIENTE,
  })
  estado: DespachoEnum;

  @Column({ type: 'timestamptz', nullable: true })
  fecha_preparacion: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  fecha_envio: Date | null;
}
