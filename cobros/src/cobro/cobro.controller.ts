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
import { CobroService } from './cobro.service';
import { CreateCobroDto } from './dto/create-cobro.dto';
import { UpdateCobroDto } from './dto/update-cobro.dto';

@Controller('cobro')
export class CobroController {
  constructor(private readonly cobroService: CobroService) {}

  @Post()
  create(@Body() createCobroDto: CreateCobroDto) {
    return this.cobroService.create(createCobroDto);
  }

  @Get()
  findAll() {
    return this.cobroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.cobroService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCobroDto: UpdateCobroDto,
  ) {
    return this.cobroService.update(id, updateCobroDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.cobroService.remove(id);
  }
}
