import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature( [ User ] ),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: {
    //     expiresIn: '2h'
    //   }
    // })
  ],
  providers: [AuthService],
  exports: [ TypeOrmModule ],
})
export class AuthModule {}
