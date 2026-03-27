export interface User {
  _id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  nickName?: string;
  avatarUrl?: string;
  bio?: string;
  isInstructor?: boolean;
  isAdmin?: boolean;
  favoriteLessonIds?: string[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;

}



// export interface AuthResponse {
//   token: string;
//   user: User;
// }


