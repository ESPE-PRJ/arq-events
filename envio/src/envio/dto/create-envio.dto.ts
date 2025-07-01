import { IsUUID, IsEnum, IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnvioEnum } from 'src/enums/envio.enum';

export class CreateEnvioDto {
  @ApiProperty({
    example: 'despacho-12345',
    description: 'ID del despacho asociado al envío',
  })
  @IsUUID()
  despacho_id: string;

  @ApiProperty({ enum: EnvioEnum, default: EnvioEnum.PENDIENTE })
  @IsEnum(EnvioEnum)
  estado: EnvioEnum;

  @ApiProperty({
    example: 'transportista-12345',
    description: 'ID del transportista encargado del envío',
  })
  @ApiProperty({
    example: 'transportista-12345',
    description: 'ID del transportista encargado del envío',
  })
  @IsString()
  transportista: string;

  @ApiProperty({
    example: 'guia-12345',
    description: 'Número de guía del envío',
  })
  @IsString()
  numero_guia: string;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Fecha de envío del paquete',
  })
  @IsDateString()
  fecha_envio: Date;

  @ApiProperty({
    example: '2023-10-01T14:00:00Z',
    description: 'Fecha estimada de entrega del paquete',
  })
  @IsDateString()
  fecha_entrega: Date;
}
