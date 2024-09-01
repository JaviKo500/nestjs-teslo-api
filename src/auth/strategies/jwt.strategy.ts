import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    validate = async ( payload: JwtPayloadInterface): Promise<User> => {
        const { email } = payload;
        const user  = await this.userRepository.findOneBy({email});
        if ( !user ) 
            throw new UnauthorizedException( 'Invalid token' );
        if ( !user.isActive )
            throw new UnauthorizedException( 'User is inactive, talk with admin' );

        return user;
    }
}