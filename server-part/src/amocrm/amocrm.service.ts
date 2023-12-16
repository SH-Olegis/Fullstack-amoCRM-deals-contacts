import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { readJsonFile } from '../utils/read-write-json-file';

import { Contact } from './interfaces/contacts.interfaces';
import { ClientResponse, LeadsResponse } from './interfaces/leads.interfaces'
import { PipelineResponse } from './interfaces/pipelines.interfaces';
import { UsersResponse } from './interfaces/users.interfaces';

import stateStatus from './config/state-status';

import * as path from 'path';

@Injectable()
export class AmoCRMService {
  private readonly apiUrl: string;
  private accessToken: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('AMOCRM_API_URL');
    this.accessToken = this.configService.get<string>('AMOCRM_ACCESS_TOKEN');
  }

  async getContacts(searchParam: string): Promise<Contact> {
    try {
      return this.sendRequest('contacts', searchParam, 'leads')
    } catch (error) {
      throw Error(error)
    }
  }

  async getLeads(searchParam: string): Promise<ClientResponse[]> {
    try {
      const leads = await this.sendRequest<LeadsResponse>('leads', searchParam, 'contacts');
      const statuses = await this.getStatusesNames();
      const responsiblesNames = await this.getResponsibleNames();

      return leads._embedded.leads.map(lead => ({
        name: lead.name,
        budget: lead.price,
        date: new Date(lead.created_at * 1000),
        status: statuses.find(status => status.id === lead.status_id)?.name,
        responsible: responsiblesNames.find(responsible => responsible.id === lead.responsible_user_id)?.name,
      }))

    } catch(error) {
      throw Error(error)
    }
  }

  async getPipelines(): Promise<PipelineResponse> {
    return await this.sendRequest<PipelineResponse>('leads/pipelines')
  }

  async getStatusesNames () {
    const pipelines = await this.getPipelines()

    return pipelines._embedded.pipelines.flatMap(pipeline =>
        pipeline._embedded.statuses.map(status => ({
          id: status.id,
          name: status.name,
        }))
    );
  }

  async getUsers (): Promise<UsersResponse> {
    return await this.sendRequest('users')
  }

  async getResponsibleNames (){
    const responsibles = await this.getUsers();

    return responsibles._embedded.users.map(user => ({
      id: user.id,
      name: user.name,
    }));
  }

  private async sendRequest<T>(entity: string, searchParam: string = '', withParam: string = ''): Promise<T> {
    try {
      const response = await firstValueFrom(
          this.httpService.get(`${this.apiUrl}/api/v4/${entity}`, {
            params: {
              query: searchParam,
              with: withParam
            },
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }),
      );

      return response.data;
    } catch (error) {
      if (error.response.data.title === stateStatus.UNAUTHORIZED) {
        try {
          await this.refreshAccessToken();
        } catch (error) {
          throw Error(error)
        }
      }

      return error
    }
  }

  async refreshAccessToken() {
    const authData = await readJsonFile(path.join(__dirname, '../config/amoCRMInfo.json'));
    const tokens = await readJsonFile(path.join(__dirname, '../config/tokensInfo.json'));

    try {
      const refreshData = {
        ...authData,
        grant_type: 'refresh_token',
        refresh_token: tokens.refresh_token,
      };

      const { data: tokensData } = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/oauth2/access_token`,
          refreshData,
        ),
      );

      this.accessToken = tokensData.access_token;

      return tokensData
    } catch (error) {
      if (error.response.data.hint === stateStatus.REFRESH_TOKEN_NOT_AVAILABLE) {
        throw Error('Refresh token not available, please update your tokens from amoCRM service')
      }
    }
  }

  async registerAccount() {
    const amoCRMInfo = await readJsonFile(path.join(__dirname, '..', 'config/amoCRMInfo.json'))
    const amoCRMCodeIntegration = await readJsonFile(path.join(__dirname, '..', 'config/codeAmoCRM.json'))

    const registerData = {
      ...amoCRMInfo,
      ...amoCRMCodeIntegration,
      grant_type: 'authorization_code'
    }

    try {
      const { data: tokensData } = await firstValueFrom(
          this.httpService.post(
              `${this.apiUrl}/oauth2/access_token`,
              registerData,
          ),
      );

      return tokensData
    } catch (error) {
      console.log(error);
    }
  }
}
