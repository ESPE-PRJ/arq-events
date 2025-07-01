import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Envio } from '../entities/envio.entity';
import { Despacho } from '../entities/despacho.entity';
import { EnvioService } from './envio.service';
import { EnvioController } from './envio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Envio, Despacho])],
  controllers: [EnvioController],
  providers: [EnvioService],
})
export class EnvioModule {}
