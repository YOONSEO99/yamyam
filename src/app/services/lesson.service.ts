import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Lesson } from '../models/lesson';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LessonService {
  private readonly API = 'http://localhost:3000/api/v1';

  // ✅ 전역 favourite ID 집합 - single source of truth
  private _favouriteIds = signal<Set<string>>(new Set());
  readonly favouriteIds = this._favouriteIds.asReadonly();

  constructor(private http: HttpClient) { }

  // ✅ 초기화: 로그인 후 또는 앱 시작 시 한 번 호출
  loadFavouriteIds(userId: string): void {
    this.getFavouriteLessons(userId).subscribe({
      next: (lessons) => {
        this._favouriteIds.set(new Set(lessons.map(l => l._id)));
      },
      error: (err) => console.error('Failed to load favourites', err)
    });
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
    if (userStr) {
      const userObj = JSON.parse(userStr);
      currentUserId = userObj._id;
    }
    return this.http.post<Lesson>(`${this.API}/lessons`, {
      ...body,
      instructorId: currentUserId
    });
  }

  updateLesson(
    id: string,
    data: Partial<Pick<Lesson, 'title' | 'description' | 'category' | 'status'>>
  ) {
    return this.http.put<Lesson>(`${this.API}/lessons/${id}`, data);
  }

  getMyLessons(userId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.API}/lessons`, {
      params: { instructorId: userId }
    });
  }

  getFavouriteLessons(userId: string) {
    return this.http.get<Lesson[]>(`${this.API}/lessons/favourites?userId=${userId}`);
  }

  toggleFavouriteLesson(lessonId: string, userId: string): Observable<any> {
    const wasFavourited = this._favouriteIds().has(lessonId);

    // ✅ Optimistic update - 즉시 UI 반영
    this._favouriteIds.update(set => {
      const next = new Set(set);
      if (wasFavourited) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });

    return this.http
      .post(`${this.API}/lessons/${lessonId}/favourites`, { userId })
      .pipe(
        // ✅ 실패 시 롤백
        tap({
          error: () => {
            this._favouriteIds.update(set => {
              const rollback = new Set(set);
              if (wasFavourited) {
                rollback.add(lessonId);
              } else {
                rollback.delete(lessonId);
              }
              return rollback;
            });
          }
        })
      );
  }
}