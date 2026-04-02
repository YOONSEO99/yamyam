import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Lesson } from '../../models/lesson';
import { lessonMock } from '../../data/lesson-mock';

@Component({
  selector: 'app-my-lessons',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-lessons.component.html',
  styleUrl: './my-lessons.component.scss'
})
export class MyLessonsComponent {
  activeTab = signal<'lessons' | 'favourites' | 'messages'>('lessons');

  stats = { lessons: 3, students: 254, favourites: 42 };

  myLessons: Lesson[] = [
    lessonMock({ _id: '1', title: 'React 19 + TypeScript Complete Bootcamp', description: '', category: 'IT·Dev', isFavourited: false, instructorId: 'u1', instructorNickname: 'MinJun Kim', studentsCount: 128, rating: 4.9, status: 'published', createdAt: '2024-11-01', updatedAt: '2025-01-15' }),
    lessonMock({ _id: '3', title: 'Node.js REST API — Build & Deploy', description: '', category: 'IT·Dev', isFavourited: false, instructorId: 'u1', instructorNickname: 'MinJun Kim', studentsCount: 98, rating: 4.9, status: 'published', createdAt: '2024-09-10', updatedAt: '2025-02-01' }),
    lessonMock({ _id: '9', title: 'MongoDB Schema Design & Aggregation', description: '', category: 'IT·Dev', isFavourited: false, instructorId: 'u1', instructorNickname: 'MinJun Kim', studentsCount: 0, status: 'draft', createdAt: '2025-03-01', updatedAt: '2025-03-01' }),
  ];
}
