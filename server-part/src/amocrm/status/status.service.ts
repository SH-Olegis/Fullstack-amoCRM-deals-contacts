import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { Status } from './status.interfaces';
import { PIPELINE_ID } from '../leads/leads.service';

@Injectable()
export class StatusService {
  constructor(private authService: AuthService) {}

  async getStatus(statusId: number) {
    const {
      data: { id, color, name },
    } = await this.authService.api.get<Status>(
      `/api/v4/leads/pipelines/${PIPELINE_ID}/statuses/${statusId}`,
    );

    return {
      id,
      name,
      color,
    };
  }
}
