import {
  IsUUID,
  IsEnum,
  IsInt,
  Min,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InventarioEnum } from '../../enums/inventario.enum';

export class CreateInventarioDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'UUID del producto',
  })
  @IsUUID()
  producto_id: string;

  @ApiProperty({
    example: InventarioEnum.ENTRADA,
    enum: InventarioEnum,
    description: 'Tipo de movimiento de inventario',
  })
  @IsEnum(InventarioEnum)
  tipo: InventarioEnum;

  @ApiProperty({ example: 10, description: 'Cantidad de unidades' })
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiPropertyOptional({
    example: 'Ajuste de stock',
    description: 'Motivo del movimiento',
  })
  @IsOptional()
  @IsString()
  motivo?: string;
}
