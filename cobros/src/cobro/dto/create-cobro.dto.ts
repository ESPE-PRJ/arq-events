import { IsEnum, IsString, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CobroEnum } from 'src/enums/cobro.enum';

export class CreateCobroDto {
  @ApiProperty({
    example: 'order-12345',
    description: 'ID de la orden asociada al cobro',
  })
  @IsUUID()
  orden_id: string;

  @ApiProperty({ enum: CobroEnum })
  @IsEnum(CobroEnum)
  estado: CobroEnum;

  @ApiProperty({
    example: 'tarjeta de crédito',
    description: 'Método de pago utilizado para el cobro',
  })
  @IsString()
  @MaxLength(50)
  metodo_pago: string;
}
