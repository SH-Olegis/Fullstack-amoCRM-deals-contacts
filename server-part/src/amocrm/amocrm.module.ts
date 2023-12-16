import { Module } from '@nestjs/common';
import { AmoCRMService } from './amocrm.service';
import { ArmCRMController } from './amocrm.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [HttpModule, ConfigModule.forRoot()],
    controllers: [ArmCRMController],
    providers: [AmoCRMService],
    exports: [AmoCRMService]
})
export class AmoCRMModule {}
