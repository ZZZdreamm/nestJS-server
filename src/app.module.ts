import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SocialAppModule } from './socialApp/socialApp.module';
import { CacarrotAppModule } from './cacarrot/cacarrotApp.module';
import { NewsAppModule } from './hotNews/news.module';
import { RequestPrioritizationService } from './requestsMiddleware/requestPrioritization.service';
import { RequestPrioritizationMiddleware } from './requestsMiddleware/requestPrioritization.middleware';

@Module({
  imports: [SocialAppModule, CacarrotAppModule, NewsAppModule],
  exports: [],
  controllers: [],
  providers: [RequestPrioritizationService],
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
