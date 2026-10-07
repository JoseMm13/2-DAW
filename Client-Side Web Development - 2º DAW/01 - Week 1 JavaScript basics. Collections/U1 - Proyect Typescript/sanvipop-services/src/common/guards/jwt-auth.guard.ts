import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { catchError, map, Observable, of, from } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const canActivate = super.canActivate(context);
    const canActivate$ =
      canActivate instanceof Promise
        ? from(canActivate)
        : (canActivate as Observable<boolean>);

    if (isPublic) {
      return canActivate$.pipe(
        catchError(() => of(true)),
        map(() => true),
      );
    }

    return canActivate$;
  }

  handleRequest(err: any, user: any, _info: any, context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (err && !isPublic) {
      throw err || new UnauthorizedException();
    }

    if (!user && !isPublic) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
