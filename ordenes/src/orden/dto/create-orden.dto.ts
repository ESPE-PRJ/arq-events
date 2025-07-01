import {
  IsUUID,
  IsArray,
  ValidateNested,
  IsInt,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CreateOrdenItemDto {
  @ApiProperty({
    example: 'b3b7c2e2-1c2d-4e2a-8b2a-2b2a2b2a2b2a',
    description: 'UUID del producto',
  })
  @IsUUID()
  id_producto: string;

  @ApiProperty({ example: 2, description: 'Cantidad de productos' })
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiProperty({ example: 100.5, description: 'Precio unitario del producto' })
  @IsNumber()
  @Min(0)
  precio_unitario: number;
}

export class CreateOrdenDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'UUID del cliente',
  })
  @IsUUID()
  cliente_id: string;

  @ApiProperty({
    type: [CreateOrdenItemDto],
    description: 'Lista de items de la orden',
    example: [
      {
        id_producto: 'b3b7c2e2-1c2d-4e2a-8b2a-2b2a2b2a2b2a',
        cantidad: 2,
        precio_unitario: 100.5,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrdenItemDto)
  orden_items: CreateOrdenItemDto[];
}
