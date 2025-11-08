import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class Verify2FADto {
  @ApiProperty({
    description: 'Código TOTP de 6 dígitos gerado pelo app autenticador',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'O código 2FA é obrigatório' })
  @Length(6, 6, { message: 'O código 2FA deve ter 6 dígitos' })
  token: string;
}
