import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    
  }
  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create( createUserDto );
      await this.userRepository.save( user );
      return user;
    } catch (error) {
      this.handelDBExceptions(error)
    }
  }

  private handelDBExceptions(error: any): never {
    if ( error.code === '23505') 
      throw new BadRequestException(error.detail);
    
    if ( error.status === 404 ) 
      throw new NotFoundException( error.message );
    
    this.logger.error( `${error.message} - ${error.detail}` );
    throw new InternalServerErrorException('Unexpected error check server logs');
  }
}
