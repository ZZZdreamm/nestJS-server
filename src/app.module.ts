import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SocialAppModule } from './socialApp/socialApp.module';
import { CacarrotAppModule } from './cacarrot/cacarrotApp.module';
import { NewsAppModule } from './hotNews/news.module';
import { RequestPrioritizationService } from './requestsMiddleware/requestPrioritization.service';
import { RequestPrioritizationMiddleware } from './requestsMiddleware/requestPrioritization.middleware';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/ExceptionFilter';

@Module({
  imports: [SocialAppModule, CacarrotAppModule, NewsAppModule],
  exports: [],
  controllers: [],
  providers: [
    RequestPrioritizationService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(
    private readonly requestPrioritizationService: RequestPrioritizationService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestPrioritizationMiddleware).forRoutes('*');
  }

  async onModuleInit() {
    this.requestPrioritizationService.processRequests();
  }
}
