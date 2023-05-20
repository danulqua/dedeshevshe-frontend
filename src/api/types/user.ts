export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface UserDTO {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface EditProfileDTO {
  name: string;
  password?: string;
}
