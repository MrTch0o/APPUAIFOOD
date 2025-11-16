import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateRestaurantDto } from '../../modules/restaurants/dto/update-restaurant.dto';

@Injectable()
export class ParseRestaurantUpdatePipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    // Converter para instância da classe
    const object = plainToInstance(UpdateRestaurantDto, value);

    // Validar com class-validator
    const errors = await validate(object, {
      skipMissingProperties: true,
      skipUndefinedProperties: true,
      whitelist: true,
      forbidNonWhitelisted: false, // Permitir campos extras como openingHours
    });

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => {
          if (error.constraints) {
            return `${error.property}: ${Object.values(error.constraints).join(', ')}`;
          }
          return `${error.property}: ${error.toString()}`;
        })
        .join('; ');

      throw new BadRequestException({
        message: 'Erro na validação dos dados',
        errors: errorMessages,
      });
    }

    return object;
  }
}
