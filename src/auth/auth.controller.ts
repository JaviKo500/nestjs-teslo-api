import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/get-raw-header.decorator';
import { UserRolGuard } from './guards/user-rol.guard';
import { Auth, RoleProtected } from './decorators';
import { ValidRoles } from './interfaces';

@ApiTags( 'Auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create( createUserDto );
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.authService.login( loginUserDto );
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  @ApiBearerAuth()
  testingPrivateRoutes(
    // @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    return {
      ok: true,
      message: 'Hello world private',
      user,
      userEmail,
      rawHeaders
    }
  }

  // @SetMetadata( 'roles', [ 'admin', 'super-user', 'user'] )
  @Get('private2')
  @RoleProtected( ValidRoles.superUser, ValidRoles.user )
  @UseGuards( AuthGuard(), UserRolGuard )
  @ApiBearerAuth()
  testingPrivate2Routes(
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      user,
    }
  }

  @Get('private3')
  @Auth( ValidRoles.superUser, ValidRoles.user )
  @ApiBearerAuth()
  testingPrivate3Routes(
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      user,
    }
  }

  @Get('check-status')
  @Auth()
  @ApiBearerAuth()
  checkAuthStatus(
    @GetUser() user: User,
  ) {
    return this.authService.checkAuthStatus( user );
  }
}
