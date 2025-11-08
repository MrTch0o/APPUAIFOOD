import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class Disable2FADto {
  @ApiProperty({
    description: 'Código TOTP de 6 dígitos para confirmar desativação do 2FA',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'O código de verificação é obrigatório' })
  @Length(6, 6, { message: 'O código deve ter 6 dígitos' })
  token: string;
}
