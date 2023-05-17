import { apiClient } from '@/api/apiClient';
import type { EditProfileDTO, UserDTO } from '@/api/types/user';

class UserService {
  async getMyProfile() {
    const response = await apiClient.get<UserDTO>('/api/user/profile');
    return response.data;
  }

  async editProfile(dto: EditProfileDTO) {
    const response = await apiClient.patch<UserDTO>('/api/user/editProfile', dto);
    return response.data;
  }
}

export const userService = new UserService();
