import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard for protecting routes with JWT.
 * Use @UseGuards(JwtAuthGuard) on controllers.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}