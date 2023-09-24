// src/request-prioritization/request-prioritization.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestPrioritizationService {
  private requestQueue: { data: any; priority: string }[] = [];

  addToQueue(data: any, priority: string) {
    this.requestQueue.push({ data, priority });
  }

  processRequests() {
    setInterval(() => {
      this.requestQueue.sort((a, b) => {
        return (
          this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority)
        );
      });

      if (this.requestQueue.length > 0) {
        const highestPriorityRequest = this.requestQueue.shift();
        // console.log('Processing request:', highestPriorityRequest.data);
      }
    });
  }

  private getPriorityValue(priority: string): number {
    switch (priority) {
      case 'high':
        return 3;
      case 'medium':
        return 2;
      case 'low':
        return 1;
      default:
        return 0;
    }
  }
}
