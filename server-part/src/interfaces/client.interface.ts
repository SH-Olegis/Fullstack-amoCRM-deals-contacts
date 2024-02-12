import { AmoCrmAuth } from './amocrm.interface';

export interface IClient {
  access_token: string;
  refresh_token: string;
  expires_date: Date;
  settings: AmoCrmAuth;
  name: string;
}
