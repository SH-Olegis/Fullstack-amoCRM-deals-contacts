import { EmbeddedContact } from '../contacts/contacts.interfaces';

export interface EmbeddedLead {
  id: number;
  name: string;
  price: number;
  responsible_user_id: number;
  status_id: number;
  created_at: number;
  _embedded: {
    contacts: EmbeddedContact[];
  };
}

export interface LeadsResponse {
  _embedded: {
    leads: EmbeddedLead[];
  };
}
