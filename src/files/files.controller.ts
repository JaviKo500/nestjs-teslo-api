import { diskStorage } from 'multer';
import { Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Res, Param} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FilesService } from './files.service';
import { fileFilterHelper, fileNamerHelper } from './helpers';
import { ConfigService } from '@nestjs/config';

@ApiTags( 'Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

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
    // const image = `${this.configService.get('HOST_API')}/files/products/${file.filename}`;
    const image = file.filename;
    return {
      image
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
