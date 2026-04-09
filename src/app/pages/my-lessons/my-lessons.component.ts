import { LessonService } from './../../services/lesson.service';
import { AuthService } from '../../services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Lesson } from '../../models/lesson';
import { User } from '../../models/user';

@Component({
  selector: 'app-my-lessons',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-lessons.component.html',
  styleUrl: './my-lessons.component.scss'
})
export class MyLessonsComponent {
  private lessonService = inject(LessonService);
  protected auth = inject(AuthService);

  activeTab = signal<'lessons' | 'favourites' | 'messages'>('lessons');
  isLoading = signal<boolean>(false);
  myLessons = signal<Lesson[]>([]);
  deletingId = signal<string | null>(null);

  stats = { lessons: 0, students: 254, favourites: 42 };

  ngOnInit(): void {
    this.loadMyLessons();
  }

  loadMyLessons() {
    const userJson = localStorage.getItem('user');

    if (userJson) {
      try {
        const userData = JSON.parse(userJson);

        const myId = userData._id;

        if (myId) {
          this.isLoading.set(true);
          this.lessonService.getMyLessons(myId).subscribe({
            next: (data) => {
              this.myLessons.set(data);
              this.stats.lessons = data.length;
              this.isLoading.set(false);
            },
            error: (err) => {
              console.error('Failed to fetch:', err);
              this.isLoading.set(false);
            }
          });
        }
      } catch (e) {
        console.error('JSON Parsing Error:', e);
      }
    } else {
      console.error('User data not found in storage. Please login again.');
    }
  }

  isLessonOwner(l: Lesson): boolean {
    const uid = this.auth.currentUser()?._id;
    if (!uid) return false;
    const inst = l.instructorId;
    const instId = typeof inst === 'string' ? inst : (inst as User)?._id;
    return uid === instId;
  }

  confirmDelete(l: Lesson) {
    if (!this.isLessonOwner(l)) return;
    const uid = this.auth.currentUser()?._id;
    if (!uid) return;
    if (!confirm(`Delete "${l.title}"? This cannot be undone.`)) return;
    this.deletingId.set(l._id);
    this.lessonService.deleteLesson(l._id, uid).subscribe({
      next: () => {
        this.myLessons.update((list) => list.filter((x) => x._id !== l._id));
        this.stats.lessons = this.myLessons().length;
        this.deletingId.set(null);
      },
      error: () => {
        this.deletingId.set(null);
        alert('Could not delete this lesson.');
      }
    });
  }
}