/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import serverConfig from 'config/server.config';
import { Observable } from 'rxjs';

@Injectable()
export class ServerHeaderInterceptor implements NestInterceptor {
  private readonly config = serverConfig();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    response.setHeader('Server', this.config.header);
    return next.handle();
  }
}
