import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';

export class Login2FADto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@example.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'SenhaSegura@123',
  })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password: string;

  @ApiProperty({
    description:
      'Código TOTP de 6 dígitos (obrigatório se 2FA estiver ativado)',
    example: '123456',
    minLength: 6,
    maxLength: 6,
    required: false,
  })
  @IsString()
  @Length(6, 6, { message: 'O código 2FA deve ter 6 dígitos' })
  twoFactorToken?: string;
}
