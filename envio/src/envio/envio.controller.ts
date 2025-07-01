import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EnvioService } from './envio.service';
import { CreateEnvioDto } from './dto/create-envio.dto';
import { UpdateEnvioDto } from './dto/update-envio.dto';

@Controller('envio')
export class EnvioController {
  constructor(private readonly envioService: EnvioService) {}

  @Post()
  create(@Body() dto: CreateEnvioDto) {
    return this.envioService.create(dto);
  }

  @Get()
  findAll() {
    return this.envioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.envioService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateEnvioDto,
  ) {
    return this.envioService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.envioService.remove(id);
  }
}
