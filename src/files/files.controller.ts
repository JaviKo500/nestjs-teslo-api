import { Controller, Post, Body, UploadedFile, UseInterceptors, BadRequestException} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilterHelper } from './helpers/file-filter.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilterHelper
  }) )
  uploadProductImage( @UploadedFile( ) file: Express.Multer.File ) {
    if ( !file ) throw new BadRequestException( 'Make sure that file in image' );
    return file?.originalname;
  }

}
