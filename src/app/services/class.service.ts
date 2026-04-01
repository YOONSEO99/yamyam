import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Lesson } from '../models/lesson';

@Injectable({ providedIn: 'root' })
export class ClassService {
  private readonly API = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) { }

  getClasses(keyword?: string, category?: string) {
    let params = new HttpParams();
    if (keyword) params = params.set('keyword', keyword);
    if (category) params = params.set('category', category);
    return this.http.get<Lesson[]>(`${this.API}/classes`, { params });
  }

  getClass(id: string) {
    return this.http.get<Lesson>(`${this.API}/classes/${id}`);
  }

  createClass(data: FormData) {
    return this.http.post<Lesson>(`${this.API}/classes`, data);
  }

  updateClass(id: string, data: FormData) {
    return this.http.patch<Lesson>(`${this.API}/classes/${id}`, data);
  }

  getMyClasses() {
    return this.http.get<Lesson[]>(`${this.API}/classes/mine`);
  }

  getFavourites() {
    return this.http.get<Lesson[]>(`${this.API}/favourites`);
  }

  toggleFavourite(classId: string) {
    return this.http.post(`${this.API}/favourites/${classId}`, {});
  }
}
