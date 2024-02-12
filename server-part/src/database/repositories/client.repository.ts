import { Injectable } from '@nestjs/common';
import { Client } from '../entities/client.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class ClientRepository extends BaseRepository<Client> {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
  ) {
    super(clientRepository);
  }
}
