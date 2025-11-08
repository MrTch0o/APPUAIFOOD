import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// Tipos de arquivo permitidos
const ALLOWED_IMAGE_TYPES = /jpeg|jpg|png|gif|webp/;

// Tamanho máximo: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      // Gera nome único: timestamp-random-originalname.ext
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  fileFilter: (req, file, callback) => {
    // Valida extensão do arquivo
    const ext = extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    const isValidExtension = ALLOWED_IMAGE_TYPES.test(ext);
    const isValidMimetype = ALLOWED_IMAGE_TYPES.test(mimetype);

    if (isValidExtension && isValidMimetype) {
      callback(null, true);
    } else {
      callback(
        new BadRequestException(
          'Formato de arquivo inválido. Permitidos: JPEG, JPG, PNG, GIF, WEBP',
        ),
        false,
      );
    }
  },
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
};
