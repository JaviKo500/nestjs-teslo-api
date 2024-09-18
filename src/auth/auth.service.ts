import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {

  }
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
        token: this.getJwtToken( { id: user.id } )
      };
    } catch (error) {
      this.handelDBExceptions(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        password: true,
        id: true,
        fullName: true,
        roles: true,
      }
    });
    if ( !user || !bcrypt.compareSync( password, user.password) ) 
      throw new UnauthorizedException( 'Invalid credentials');
    
    return {
      ...user,
      token: this.getJwtToken( { id: user.id } ),
    };
  }

  async checkAuthStatus( user: User) {
    return {
      ...user,
      token: this.getJwtToken( { id: user.id } ),
    };
  }

  private getJwtToken( payload: JwtPayloadInterface ) {
    const token = this.jwtService.sign( payload );
    return token;
  }

  private handelDBExceptions(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    if (error.status === 404)
      throw new NotFoundException(error.message);

    this.logger.error(`${error.message} - ${error.detail}`);
    throw new InternalServerErrorException('Unexpected error check server logs');
  }
}
