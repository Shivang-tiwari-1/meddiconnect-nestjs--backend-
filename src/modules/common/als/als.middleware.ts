import { Injectable, NestMiddleware } from '@nestjs/common';
import { AlsService } from './als.service';
import { NextFunction } from 'express';

@Injectable()
export class AlsMiddleware implements NestMiddleware {
  constructor(private asyncLocalStorageService: AlsService) {}
  use(req: Request, res: Response, nest: NextFunction) {
    this.asyncLocalStorageService.run(() => {
      nest();
    });
  }
}
