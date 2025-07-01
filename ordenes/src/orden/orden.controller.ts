import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrdenService } from './orden.service';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { Orden } from '../entities/orden.entity';

@Controller('orden')
export class OrdenController {
  constructor(private readonly ordenService: OrdenService) {}

  @Post()
  create(@Body() createOrdenDto: CreateOrdenDto): Promise<Orden> {
    return this.ordenService.create(createOrdenDto);
  }

  @Get()
  findAll(): Promise<Orden[]> {
    return this.ordenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Orden> {
    return this.ordenService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateData: Partial<Orden>,
  ): Promise<Orden> {
    return this.ordenService.updateOrden(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.ordenService.removeOrden(id);
  }
}
