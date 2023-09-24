import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '365 days' },
    }),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class AuthModule {}
