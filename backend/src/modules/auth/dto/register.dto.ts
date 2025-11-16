import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'usuario@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Senha@123', minLength: 8 })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '31987654321', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: UserRole.CLIENT,
    enum: [UserRole.CLIENT, UserRole.RESTAURANT_OWNER],
    required: false,
    description:
      'Role do usuário. Padrão: CLIENT. RESTAURANT_OWNER para donos de restaurante.',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
