import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Nova senha (mínimo 6 caracteres)',
    example: 'NovaSenha@123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'A nova senha deve ter pelo menos 6 caracteres' })
  newPassword: string;
}
