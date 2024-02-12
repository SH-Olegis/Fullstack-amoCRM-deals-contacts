import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { LeadsResponse } from './leads.interfaces';
import dayjs from 'dayjs';

export const PIPELINE_ID = 6914958;

@Injectable()
export class LeadsService {
  constructor(private authService: AuthService) {}

  async getLeads(searchParam?: string) {
    const {
      data: { _embedded: { leads = [] } = {} },
    } = await this.authService.api.get<LeadsResponse>('/api/v4/leads', {
      params: {
        query: searchParam,
        with: 'contacts',
        filter: {
          pipeline_id: PIPELINE_ID,
        },
      },
    });

    return leads.map(
      ({
        id,
        name,
        price,
        created_at,
        responsible_user_id,
        status_id,
        _embedded: { contacts },
      }) => {
        const contacts_ids = contacts.map((contact) => contact.id);

        return {
          id,
          name,
          price,
          created_at: dayjs().add(created_at).format('DD.MM.YYYY HH:m'),
          contacts_ids: contacts_ids.length ? contacts_ids : null,
          responsible_user_id,
          status_id,
        };
      },
    );
  }
}
