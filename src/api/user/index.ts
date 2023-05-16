import { apiClient } from '@/api/apiClient';
import type { UserDTO } from '@/api/types/user.dto';

class UserService {
  async getMyProfile() {
    const response = await apiClient.get<UserDTO>('/api/user/profile');
    return response.data;
  }
}

export const userService = new UserService();
