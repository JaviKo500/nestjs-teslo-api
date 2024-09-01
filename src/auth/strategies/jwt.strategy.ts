import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';

export class JwtStrategy extends PassportStrategy( Strategy ) {
    validate = async ( payload: JwtPayloadInterface): Promise<User> => {
        const { email } = payload;
        
        return;
    }
}