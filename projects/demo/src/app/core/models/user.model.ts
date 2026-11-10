export type UserRole = 'Admin' | 'User';

export interface User {
  name: string;
  email: string;
  role: UserRole;
}
