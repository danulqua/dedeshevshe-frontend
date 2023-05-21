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

export interface UserListDTO {
  totalCount: number;
  totalPages: number;
  items: UserDTO[];
}

export interface EditProfileDTO {
  name: string;
  password?: string;
}

export interface EditUserDTO extends EditProfileDTO {
  email?: string;
  role?: UserRole;
}

export interface UserSearchParams {
  email?: string;
  name?: string;
  role?: UserRole;
  limit?: number;
  page?: number;
  sortBy?: keyof UserDTO;
  order?: 'asc' | 'desc';
}
