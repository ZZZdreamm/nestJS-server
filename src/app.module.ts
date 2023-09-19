import { Module } from '@nestjs/common';
import { SocialAppModule } from './socialApp/socialApp.module';
import { CacarrotAppModule } from './cacarrot/cacarrotApp.module';
import { NewsAppModule } from './hotNews/news.module';

@Module({
  imports: [SocialAppModule, CacarrotAppModule, NewsAppModule],
  exports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
