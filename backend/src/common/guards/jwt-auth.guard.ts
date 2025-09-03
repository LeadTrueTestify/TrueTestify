import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: import('@nestjs/common').ExecutionContext,
    status?: any
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or missing JWT token');
    }
    // Ensure request.user contains sub, email, and businessId
    return {
      sub: user.sub,
      email: user.email,
      businessId: user.businessId,
    } as TUser;
  }
}