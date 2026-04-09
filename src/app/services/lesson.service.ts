import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Lesson } from '../models/lesson';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LessonService {
  private readonly API = 'http://localhost:3000/api/v1';

  private _favouriteIds = signal<Set<string>>(new Set());
  readonly favouriteIds = this._favouriteIds.asReadonly();

  constructor(private http: HttpClient) { }

  initFavourites(ids: string[]) {
    this._favouriteIds.set(new Set(ids));
  }

  isFavourited(lessonId: string): boolean {
    return this._favouriteIds().has(lessonId);
  }

  getLessons(keyword?: string, category?: string) {
    let params = new HttpParams();
    if (keyword) params = params.set('keyword', keyword);
    if (category) params = params.set('category', category);
    return this.http.get<Lesson[]>(`${this.API}/lessons`, { params });
  }

  getLessonById(id: string) {
    return this.http.get<Lesson>(`${this.API}/lessons/${id}`);
  }

  createLesson(body: any) {
    const userStr = localStorage.getItem('user');
    let currentUserId = '';
    if (userStr) currentUserId = JSON.parse(userStr)._id;
    return this.http.post<Lesson>(`${this.API}/lessons`, {
      ...body,
      instructorId: currentUserId
    });
  }

  updateLesson(id: string, data: Partial<Pick<Lesson, 'title' | 'description' | 'category' | 'status'>>) {
    return this.http.put<Lesson>(`${this.API}/lessons/${id}`, data);
  }

  deleteLesson(id: string, userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API}/lessons/${id}`, {
      params: { userId }
    });
  }

  /** Dashboard: lessons the user enrolled in (public only) + lessons they teach (any status) */
  getMyLessons(userId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.API}/lessons/me`, {
      params: { userId }
    });
  }

  enrollInLesson(lessonId: string, userId: string): Observable<{ enrolledLessonIds: string[] }> {
    return this.http.post<{ enrolledLessonIds: string[] }>(
      `${this.API}/lessons/${lessonId}/enroll`,
      { userId }
    );
  }

  getFavouriteLessons(userId: string) {
    return this.http.get<Lesson[]>(`${this.API}/lessons/favourites?userId=${userId}`);
  }

  toggleFavouriteLesson(lessonId: string, userId: string): Observable<any> {
    const wasFavourited = this._favouriteIds().has(lessonId);

    this._favouriteIds.update(set => {
      const next = new Set(set);
      wasFavourited ? next.delete(lessonId) : next.add(lessonId);
      return next;
    });

    return this.http.post(`${this.API}/lessons/${lessonId}/favourites`, { userId }).pipe(
      tap({
        error: () => {
          this._favouriteIds.update(set => {
            const rollback = new Set(set);
            wasFavourited ? rollback.add(lessonId) : rollback.delete(lessonId);
            return rollback;
          });
        }
      })
    );
  }
}