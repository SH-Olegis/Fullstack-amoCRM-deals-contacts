import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { User } from './users.interfaces';

@Injectable()
export class UsersService {
  constructor(private authService: AuthService) {}

  async getUser(userId: number) {
    if (!userId) {
      return null;
    }

    const {
      data: { id, email, name },
    } = await this.authService.api.get<User>(`/api/v4/users/${userId}`);

    return {
      id,
      name,
      email,
    };
  }
}
