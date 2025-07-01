import { BaseEntity } from 'common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Orden } from './orden.entity';

@Entity()
export class Cliente extends BaseEntity {
  @Column({ type: 'text' })
  nombre: string;

  @Column({ type: 'text' })
  correo: string;

  @Column({ type: 'text' })
  direccion: string;

  @OneToMany(() => Orden, (orden) => orden.cliente)
  ordenes: Orden[];
}
