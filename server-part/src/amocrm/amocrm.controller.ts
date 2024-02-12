import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { LeadsService } from './leads/leads.service';
import { ContactsService } from './contacts/contacts.service';
import { UsersService } from './users/users.service';
import { StatusService } from './status/status.service';
import * as async from 'async';

@Controller('leads')
export class ArmCRMController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly contactsService: ContactsService,
    private readonly usersService: UsersService,
    private readonly statusService: StatusService,
  ) {}

  @Get()
  async getLeads(@Query('search') searchParam: string) {
    const leadsData = await this.leadsService.getLeads(searchParam);
    const results = [];

    await async.eachLimit(leadsData, 4, async (lead) => {
      const contacts = await this.contactsService.getContacts(
        lead.contacts_ids,
      );

      const responsibleUser = await this.usersService.getUser(
        lead.responsible_user_id,
      );

      const status = await this.statusService.getStatus(lead.status_id);

      results.push({
        ...lead,
        contacts: contacts.length ? contacts : null,
        responsible_user: responsibleUser,
        status,
      });
    });

    return results;
  }
}
