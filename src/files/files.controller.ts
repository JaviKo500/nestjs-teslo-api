import { diskStorage } from 'multer';
import { Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Res, Param} from '@nestjs/common';

import { FilesService } from './files.service';
import { fileFilterHelper, fileNamerHelper } from './helpers';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilterHelper,
    // limits: {s
    //   fileSize: 3000
    // },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamerHelper
    })
  }) )
  uploadProductImage( @UploadedFile( ) file: Express.Multer.File ) {
    if ( !file ) throw new BadRequestException( 'Make sure that file in image' );
    const secureUrl = `http://localhost:3000/api/files/products/${file.filename}`;
    return {
      secureUrl
    };
  }

  @Get(':type/:fileName')
  getStaticFile(
    @Res() res: Response,
    @Param('type') type: string,
    @Param('fileName') fileName: string,
  ) {
    const path = this.filesService.getStaticImage(type, fileName);
    res.sendFile(path);
  }

}
