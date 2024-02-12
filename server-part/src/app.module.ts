import { Module } from '@nestjs/common';
import { AmoCRMModule } from './amocrm/amocrm.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    AmoCRMModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
  ],
})
export class AppModule {}
