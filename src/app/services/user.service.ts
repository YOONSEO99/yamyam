import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API = 'http://localhost:3000/api/v1';
  constructor(private http: HttpClient) {}

  getUsers(page = 1) {
    return this.http.get<{ users: User[]; total: number }>(`${this.API}/users?page=${page}`);
  }

  getUser(id: string) {
    return this.http.get<User>(`${this.API}/users/${id}`);
  }

  updateProfile(data: FormData) {
    return this.http.patch<User>(`${this.API}/users/me`, data);
  }
}
