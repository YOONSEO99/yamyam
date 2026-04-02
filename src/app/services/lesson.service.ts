import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Lesson } from '../models/lesson';

@Injectable({ providedIn: 'root' })
export class LessonService {
  private readonly API = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) { }

  getLessons(keyword?: string, category?: string) {
    let params = new HttpParams();
    if (keyword) params = params.set('keyword', keyword);
    if (category) params = params.set('category', category);
    return this.http.get<Lesson[]>(`${this.API}/lessons`, { params });
  }

  getLesson(id: string) {
    return this.http.get<Lesson>(`${this.API}/lessons/${id}`);
  }

  createLesson(body: { title: string; description?: string; category: string; status?: string }) {
    return this.http.post<Lesson>(`${this.API}/lessons`, body);
  }

  updateLesson(id: string, data: Partial<Pick<Lesson, 'title' | 'description' | 'category' | 'status'>>) {
    return this.http.put<Lesson>(`${this.API}/lessons/${id}`, data);
  }

  getMyLessons() {
    return this.http.get<Lesson[]>(`${this.API}/lessons/mine`);
  }

  getFavouriteLessons() {
    return this.http.get<Lesson[]>(`${this.API}/lessons/favourites`);
  }

  toggleFavouriteLesson(lessonId: string) {
    return this.http.post(`${this.API}/lessons/favourites/${lessonId}`, {});
  }
}
