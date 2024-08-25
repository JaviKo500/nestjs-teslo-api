import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

@Injectable()
export class FilesService {
  getStaticImage(type: string, imageName: string) {
    const path = join( __dirname, `../../static/${type}`, imageName);
    if ( !existsSync( path ) ) {
      throw new BadRequestException(`Not found image /${ type }/${ imageName }`);
    }
    return path;
  }
}
