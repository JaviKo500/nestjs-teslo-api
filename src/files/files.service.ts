import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  create(createFileDto: any) {
    return 'This action adds a new file';
  }
}
