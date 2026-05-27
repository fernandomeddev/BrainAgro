import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

type RequestLike = {
  header(name: string): string | undefined;
  method: string;
  originalUrl: string;
};

type ResponseLike = {
  setHeader(name: string, value: string): void;
  on(event: 'finish', listener: () => void): void;
  statusCode: number;
};

type NextFunction = () => void;

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(request: RequestLike, response: ResponseLike, next: NextFunction) {
    const startedAt = Date.now();
    const requestId = request.header('x-request-id') ?? randomUUID();

    response.setHeader('x-request-id', requestId);
    response.on('finish', () => {
      this.logger.log({
        message: 'http.request',
        requestId,
        method: request.method,
        path: request.originalUrl,
        statusCode: response.statusCode,
        durationMs: Date.now() - startedAt
      });
    });

    next();
  }
}
