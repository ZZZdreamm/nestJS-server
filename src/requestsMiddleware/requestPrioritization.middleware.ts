// src/request-prioritization.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestPrioritizationService } from './requestPrioritization.service';

@Injectable()
export class RequestPrioritizationMiddleware implements NestMiddleware {
  constructor(
    private readonly requestPrioritizationService: RequestPrioritizationService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const requestBody = {
      ...req.body,
      ...req.query,
      ...req.params,
    };

    const priority = req.body.priority || 'medium';

    this.requestPrioritizationService.addToQueue(requestBody, priority);

    next();
  }
}
