import { Injectable, OnModuleInit } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

import { ClientRepository } from '../database/repositories/client.repository';
import {
  AmoCrmAuth,
  AmocrmCodes,
  IAmocrmData,
  IAmocrmRefreshData,
  IAmocrmRegisterData,
} from '../interfaces/amocrm.interface';
import dayjs from 'dayjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly instanceApi: AxiosInstance;

  constructor(
    private configService: ConfigService,
    private clientRepository: ClientRepository,
  ) {
    this.instanceApi = axios.create({
      baseURL: this.configService.get('BASE_API_URL'),
    });

    this.instanceApi.interceptors.request.use(
      async (config) => {
        const client = await this.clientRepository.findOne({
          where: {
            name: 'AMO',
          },
        });

        if (!client) {
          return config;
        }

        config.headers['Authorization'] = `Bearer ${client.access_token}`;

        return config;
      },
      (error) => Promise.reject(error),
    );

    this.instanceApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const errorStatus = error.response ? error.response.status : null;

        if (errorStatus === 401) {
          const { access_token } = await this.refresh();

          error.config.headers['Authorization'] = `Bearer ${access_token}`;

          return this.instanceApi.request(error.config);
        }

        return Promise.reject(error);
      },
    );
  }

  get api() {
    return this.instanceApi;
  }

  async onModuleInit() {
    const isExisting = await this.checkExistingClient();

    if (!isExisting) {
      await this.getAuth();
    }
  }

  async checkExistingClient() {
    return this.clientRepository.findOne({
      where: {
        name: 'AMO',
      },
    });
  }

  async getAuth() {
    try {
      const { data } = await this.instanceApi.post<
        any,
        AxiosResponse<AmoCrmAuth>,
        IAmocrmRegisterData
      >('oauth2/access_token', {
        ...this.getAmoData(),
        code: this.configService.get('CODE_AUTH'),
        grant_type: AmocrmCodes.REGISTER_CODE,
      });

      await this.clientRepository.saveOne({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_date: dayjs().add(data.expires_in, 'seconds').toDate(),
        settings: data,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async refresh() {
    try {
      const existingClient = await this.clientRepository.findOne({
        where: {
          name: 'AMO',
        },
      });

      const amoData = this.getAmoData();

      const { data } = await this.instanceApi.post<
        any,
        AxiosResponse<AmoCrmAuth>,
        IAmocrmRefreshData
      >('oauth2/access_token', {
        ...amoData,
        refresh_token: existingClient.refresh_token,
        grant_type: AmocrmCodes.REFRESH_CODE,
      });

      await this.clientRepository.updateOne(existingClient.id, {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_date: dayjs().add(data.expires_in, 'seconds').toDate(),
        settings: data,
      });

      return data;
    } catch (e) {
      console.log(e);
    }
  }

  getAmoData(): IAmocrmData {
    return {
      client_id: this.configService.get('ID_INTEGRATION'),
      client_secret: this.configService.get('SECRET_KEY'),
      redirect_uri: this.configService.get('REDIRECT_URI'),
    };
  }
}
