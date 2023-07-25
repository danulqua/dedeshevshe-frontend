import { apiClient } from '@/api/apiClient';
import type {
  CreateUserDTO,
  EditProfileDTO,
  EditUserDTO,
  UserDTO,
  UserListDTO,
  UserSearchParams,
} from '@/api/types/user';

class UserService {
  async getMyProfile() {
    const response = await apiClient.get<UserDTO>('/user/profile');
    return response.data;
  }

  async editProfile(dto: EditProfileDTO) {
    const response = await apiClient.patch<UserDTO>('/user/editProfile', dto);
    return response.data;
  }

  async getAllUsers(searchParams: UserSearchParams) {
    const response = await apiClient.get<UserListDTO>('/user/all', {
      params: searchParams,
    });

    return response.data;
  }

  async getUser(userId: string) {
    const response = await apiClient.get<UserDTO>(`/api/user/${userId}`);
    return response.data;
  }

  async createUser(dto: CreateUserDTO) {
    const response = await apiClient.post<UserDTO>('/user', dto);
    return response.data;
  }

  async updateUser(userId: string, dto: EditUserDTO) {
    const response = await apiClient.patch<UserDTO>(`/api/user/${userId}`, dto);
    return response.data;
  }

  async deleteUser(userId: string) {
    const response = await apiClient.delete<UserDTO>(`/api/user/${userId}`);
    return response.data;
  }
}

export const userService = new UserService();
