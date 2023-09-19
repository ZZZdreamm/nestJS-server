import { Module } from '@nestjs/common';
import { SocialAppModule } from './socialApp/socialApp.module';
import { CacarrotAppModule } from './cacarrot/cacarrotApp.module';

@Module({
  imports: [SocialAppModule, CacarrotAppModule],
  exports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
