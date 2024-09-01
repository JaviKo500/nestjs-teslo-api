import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature( [ User ] ),
    ConfigModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService = ConfigService ) => {
        // * process.env.JWT_SECRET
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h',
          }
        };
      },
    })
  ],
  providers: [ AuthService, JwtStrategy ],
  exports: [ TypeOrmModule, JwtStrategy, PassportModule, JwtModule ],
})
export class AuthModule {}
