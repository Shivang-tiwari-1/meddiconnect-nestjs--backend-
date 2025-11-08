import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGaurd } from './auth.gaurd';
import { APP_GUARD } from '@nestjs/core';
import { SupaBaseService } from './supabase-service';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [{ provide: APP_GUARD, useClass: AuthGaurd }, SupaBaseService],
  exports: [SupaBaseService],
})
export class AuthModule {}
