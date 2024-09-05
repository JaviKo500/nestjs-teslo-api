import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserRolGuard implements CanActivate {

  constructor( private readonly reflector: Reflector ) {
    
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles :string[] = this.reflector.get('roles', context.getHandler()) ?? [];

    console.log('<--------------- JK User-rol.guard --------------->');
    console.log(validRoles);
    return true;
  }
}
