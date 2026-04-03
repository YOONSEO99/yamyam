import { LessonService } from './../../services/lesson.service';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Lesson } from '../../models/lesson';
import { lessonMock } from '../../data/lesson-mock';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-my-lessons',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-lessons.component.html',
  styleUrl: './my-lessons.component.scss'
})
export class MyLessonsComponent {
  private lessonService = inject(LessonService);

  activeTab = signal<'lessons' | 'favourites' | 'messages'>('lessons');
  isLoading = signal<boolean>(false);
  myLessons = signal<Lesson[]>([]);

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
}