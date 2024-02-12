import { Module } from '@nestjs/common';
import { ArmCRMController } from './amocrm.controller';
import { AuthModule } from '../auth/auth.module';
import { LeadsService } from './leads/leads.service';
import { ContactsService } from './contacts/contacts.service';
import { UsersService } from './users/users.service';
import { StatusService } from './status/status.service';

@Module({
  imports: [AuthModule],
  controllers: [ArmCRMController],
  providers: [LeadsService, ContactsService, UsersService, StatusService],
})
export class AmoCRMModule {}
