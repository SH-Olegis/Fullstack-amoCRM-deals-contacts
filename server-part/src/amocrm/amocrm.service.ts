import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { readJsonFile } from '../utils/read-write-json-file';

import { Contact } from './contacts/contacts.interfaces';

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

  async getContacts(searchParam: string): Promise<Contact[]> {
    try {
      return this.sendRequest('contacts', searchParam, 'leads')
    } catch (error) {
      throw Error(error)
    }
  }

  async getLeads(searchParam: string): Promise<Contact[]> {
    try {
      return this.sendRequest('leads', searchParam, 'contacts');
    } catch(error) {
      throw Error(error)
    }
  }

  private async sendRequest(entity: string, searchParam: string, withParam: string): Promise<Contact[]> {
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
