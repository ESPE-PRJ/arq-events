import { IsUUID, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DespachoEnum } from 'src/enums/despacho.enum';

export class CreateDespachoDto {
  @ApiProperty({
    example: 'order-12345',
    description: 'ID de la orden asociada al despacho',
  })
  @IsUUID()
  orden_id: string;

  @ApiProperty({ enum: DespachoEnum })
  @IsEnum(DespachoEnum)
  estado: DespachoEnum;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Fecha de preparación del despacho',
  })
  @IsDateString()
  fecha_preparacion: string;

  @ApiProperty({
    example: '2023-10-01T14:00:00Z',
    description: 'Fecha de envío del despacho',
  })
  @IsDateString()
  fecha_envio: string;
}
