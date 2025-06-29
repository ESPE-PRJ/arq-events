import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Despacho } from '../entities/despacho.entity';
import { Orden } from '../entities/orden.entity';
import { DespachoService } from './despacho.service';
import { DespachoController } from './despacho.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Despacho, Orden])],
  controllers: [DespachoController],
  providers: [DespachoService],
})
export class DespachoModule {}
