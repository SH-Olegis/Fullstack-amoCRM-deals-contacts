import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import readFileData from '../utils/read-file-data';

import { Contact } from './contacts/contacts.interfaces';

const authData = readFileData('src/config/amoCRMInfo.json');
const tokens = readFileData('src/config/tokensInfo.json');
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
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/api/v4/contacts`, {
          params: {
            query: searchParam,
            with: 'leads'
          },
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }),
      );

      if (response.status === 401) {
        await this.refreshAccessToken()
        await this.getContacts(searchParam)
      }

      return response.data;
    } catch (error) {
      // Обработка ошибок
    }
  }

  async refreshAccessToken() {
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
    } catch (error) {
      // Обработка ошибок
    }
  }
}
