import { BaseEntity } from 'common/entities/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Despacho } from './despacho.entity';
import { EnvioEnum } from 'src/enums/envio.enum';

@Entity()
export class Envio extends BaseEntity {
  @OneToOne(() => Despacho)
  @JoinColumn()
  despacho: Despacho;

  @Column({ type: 'enum', enum: EnvioEnum, default: EnvioEnum.PENDIENTE })
  estado: EnvioEnum;

  @Column({ type: 'text' })
  transportista: string;

  @Column({ type: 'text' })
  numero_guia: string;

  @Column({ type: 'timestamptz', nullable: true })
  fecha_envio: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  fecha_entrega: Date | null;
}
