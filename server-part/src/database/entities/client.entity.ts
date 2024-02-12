import { Entity, Column } from 'typeorm';
import { AmoCrmAuth } from '../../interfaces/amocrm.interface';
import { Base } from './base';
import { IClient } from '../../interfaces/client.interface';

@Entity()
export class Client extends Base implements IClient {
  @Column()
  access_token: string;

  @Column()
  refresh_token: string;

  @Column()
  expires_date: Date;

  @Column({
    type: 'jsonb',
  })
  settings: AmoCrmAuth;

  @Column({ default: 'AMO' })
  name: string;
}
