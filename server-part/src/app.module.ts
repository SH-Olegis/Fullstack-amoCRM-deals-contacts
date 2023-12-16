import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AmoCRMModule } from './amocrm/amocrm.module';

@Module({
  imports: [AmoCRMModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
