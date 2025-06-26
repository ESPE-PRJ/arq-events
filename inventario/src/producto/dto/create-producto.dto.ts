import { IsString, IsNumber, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({
    example: 'PROD-001',
    description: 'Código único del producto',
  })
  @IsString()
  @MaxLength(50)
  codigo: string;

  @ApiProperty({ example: 'Laptop', description: 'Nombre del producto' })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({
    example: 'Laptop de 16GB RAM y 512GB SSD',
    description: 'Descripción del producto',
  })
  @IsString()
  @MaxLength(255)
  descripcion: string;

  @ApiProperty({ example: 1500.99, description: 'Precio del producto' })
  @IsNumber()
  @Min(0)
  precio: number;
}
