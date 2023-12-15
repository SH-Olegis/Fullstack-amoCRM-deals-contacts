import { Controller, Get, Query } from '@nestjs/common';
import { AmoCRMService } from './amocrm/amocrm.service';

@Controller('api/leads')
export class AppController {
  constructor(private readonly amoCRMService: AmoCRMService) {}

  @Get()
  async getContacts(@Query('query') searchParam: string) {
    return await this.amoCRMService.getLeads(searchParam) || []
  }
}
