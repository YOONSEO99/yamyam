export interface User {
  _id: string;
  email: string;
  nickname: string;
  avatarUrl?: string;
  bio?: string;
  role: 'student' | 'instructor';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
