import { IsString, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del cliente',
  })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({
    example: 'juan.perez@email.com',
    description: 'Correo electrónico del cliente',
  })
  @IsEmail()
  @MaxLength(100)
  correo: string;

  @ApiProperty({
    example: 'Calle 123, Ciudad, País',
    description: 'Dirección del cliente',
  })
  @IsString()
  @MaxLength(255)
  direccion: string;
}
