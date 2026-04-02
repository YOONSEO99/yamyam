import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LessonCardComponent } from '../../shared/lesson-card/lesson-card.component';
import { Lesson } from '../../models/lesson';
import { lessonMock } from '../../data/lesson-mock';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, RouterLink, LessonCardComponent],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.scss'
})
export class FavouritesComponent {
  lessons = signal<Lesson[]>([
    lessonMock({ _id: '1', title: 'React 19 + TypeScript Complete Bootcamp', description: '', category: 'IT·Dev', isFavourited: true, instructorId: 'u1', instructorNickname: 'MinJun Kim', rating: 4.9, studentsCount: 128, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '6', title: 'Angular 19 Signals & Standalone Architecture', description: '', category: 'IT·Dev', isFavourited: true, instructorId: 'u6', instructorNickname: 'Jiyeon Han', rating: 4.8, studentsCount: 65, createdAt: '', updatedAt: '' }),
  ]);

  onFavouriteToggled(lessonId: string) {
    this.lessons.update(list => list.filter(l => l._id !== lessonId));
  }
}
