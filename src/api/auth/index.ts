import { apiClient } from '@/api/apiClient';
import type { UserDTO } from '@/api/types/user.dto';

class AuthService {
  async signIn(email: string, password: string) {
    const response = await apiClient.post<UserDTO>('/api/auth/signIn', {
      email,
      password
    });

    return response.data;
  }

  async signUp(email: string, password: string) {
    const response = await apiClient.post('/api/auth/signUp', {
      email,
      password
    });

    return response.data;
  }

  async signOut() {
    const response = await apiClient.post('/api/auth/signOut');
    return response.data;
  }
}

export const authService = new AuthService();
