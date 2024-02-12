export interface AmoCrmAuth {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export interface IAmocrmData {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

export interface IAmocrmRegisterData extends IAmocrmData {
  grant_type: AmocrmCodes.REGISTER_CODE;
  code: string;
}

export interface IAmocrmRefreshData extends IAmocrmData {
  grant_type: AmocrmCodes.REFRESH_CODE;
  refresh_token: string;
}

export enum AmocrmCodes {
  REGISTER_CODE = 'authorization_code',
  REFRESH_CODE = 'refresh_token',
}
