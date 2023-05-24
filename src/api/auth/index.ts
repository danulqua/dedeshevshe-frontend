import { apiClient } from '@/api/apiClient';
import type { UserDTO } from '@/api/types/user';

class AuthService {
  async signIn(email: string, password: string) {
    const response = await apiClient.post<UserDTO>('/api/auth/signIn', {
      email,
      password,
    });

    return response.data;
  }

  async signUp(email: string, password: string) {
    const response = await apiClient.post('/api/auth/signUp', {
      email,
      password,
    });

    return response.data;
  }

  async signOut() {
    const response = await apiClient.post('/api/auth/signOut');
    return response.data;
  }

  async resetPassword(email: string) {
    const response = await apiClient.post('/api/auth/resetPassword', { email });
    return response.data;
  }

  async validateToken(token: string) {
    const response = await apiClient.post('/api/auth/validateToken', { token });
    return response.data;
  }

  async changePassword(token: string, password: string) {
    const response = await apiClient.patch('/api/auth/changePassword', { token, password });
    return response.data;
  }
}

export const authService = new AuthService();
