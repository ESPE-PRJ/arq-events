import { Module } from '@nestjs/common';
import { CobroService } from './cobro.service';
import { CobroController } from './cobro.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cobro } from '../entities/cobro.entity';
import { Orden } from 'src/entities/orden.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cobro, Orden])],
  controllers: [CobroController],
  providers: [CobroService],
})
export class CobroModule {}
