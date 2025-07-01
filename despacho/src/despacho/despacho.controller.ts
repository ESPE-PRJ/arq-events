import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DespachoService } from './despacho.service';
import { CreateDespachoDto } from './dto/create-despacho.dto';
import { UpdateDespachoDto } from './dto/update-despacho.dto';

@Controller('despacho')
export class DespachoController {
  constructor(private readonly despachoService: DespachoService) {}

  @Post()
  create(@Body() dto: CreateDespachoDto) {
    return this.despachoService.create(dto);
  }

  @Get()
  findAll() {
    return this.despachoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.despachoService.findOne(id);
  }
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateDespachoDto,
  ) {
    return this.despachoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.despachoService.remove(id);
  }
}
