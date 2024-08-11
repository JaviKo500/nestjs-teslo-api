import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilterHelper, fileNamerHelper } from './helpers';
import { diskStorage } from 'multer';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilterHelper,
    // limits: {
    //   fileSize: 3000
    // },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamerHelper
    })
  }) )
  uploadProductImage( @UploadedFile( ) file: Express.Multer.File ) {
    if ( !file ) throw new BadRequestException( 'Make sure that file in image' );
    return file?.originalname;
  }

}
