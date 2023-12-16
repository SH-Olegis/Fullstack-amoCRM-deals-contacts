import { Controller, Get } from '@nestjs/common';
import { AmoCRMService } from './amocrm.service';

@Controller('amocrm')
export class ArmCRMController {
    constructor(private readonly amoCRMService: AmoCRMService) {}

    @Get('refresh')
    async refreshToken() {
        return await this.amoCRMService.refreshAccessToken()
    }

    @Get('register')
    async registerAccount() {
        return await this.amoCRMService.registerAccount();
    }
}
