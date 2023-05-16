export type UserRole = 'USER' | 'ADMIN';

export interface UserDTO {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
