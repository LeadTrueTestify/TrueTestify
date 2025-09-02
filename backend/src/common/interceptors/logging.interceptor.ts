import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid @types/uuid

/**
 * Global interceptor for logging request_id + business_id.
 * Logs every request as per multi-tenant rules.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestId = uuidv4();
    const businessId = request.user?.businessId || 'public'; // From JWT or public

    request.requestId = requestId; // Attach for further use if needed

    this.logger.log(`Request: ${request.method} ${request.url} | request_id: ${requestId} | business_id: ${businessId}`);

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`Response for request_id: ${requestId} | business_id: ${businessId}`);
      }),
    );
  }
}