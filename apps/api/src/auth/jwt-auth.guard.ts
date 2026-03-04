import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const auth = req?.headers?.authorization as string | undefined;
    if (!auth) throw new UnauthorizedException();
    try {
      req.user = this.jwtService.verify<{ sub: string }>(auth.replace('Bearer ', ''));
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
