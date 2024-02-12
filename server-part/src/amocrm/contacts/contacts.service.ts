import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { Contact } from './contacts.interfaces';
import * as async from 'async';

@Injectable()
export class ContactsService {
  constructor(private authService: AuthService) {}

  async getContacts(ids: number[]) {
    const results: Contact[] = [];

    await async.eachLimit(ids, 4, async (id) => {
      const { data } = await this.authService.api.get<Contact>(
        `/api/v4/contacts/${id}`,
      );

      results.push(data);
    });

    return results.map(({ id, name, custom_fields_values }) => {
      return {
        id,
        name,
        custom_fields_values: custom_fields_values.map(
          ({ field_name, values }) => ({
            field_name,
            value: values[0].value,
          }),
        ),
      };
    });
  }
}
