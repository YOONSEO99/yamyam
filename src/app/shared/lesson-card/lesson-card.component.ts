import { LessonService } from './../../services/lesson.service';
import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Lesson } from '../../models/lesson';
import { User } from '../../models/user';

@Component({
  selector: 'app-lesson-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lesson-card.component.html',
  styleUrl: './lesson-card.component.scss'
})
export class LessonCardComponent {
  @Input() lesson!: Lesson;
  @Output() favouriteToggled = new EventEmitter<string>();

  private lessonService = inject(LessonService);

  get isFavourited(): boolean {
    return this.lessonService.isFavourited(this.lesson._id);
  }

  get instructor(): User | undefined {

    const id = this.lesson.instructorId;
    return typeof id === 'object' ? id : undefined;
  }

  get initials() {
    return this.instructor?.nickname?.charAt(0)?.toUpperCase() ?? '?';
  }

  get thumbBg() {
    const cats: Record<string, string> = {
      'IT·Dev': '#f0ebfa', 'Design': '#e8f0ff',
      'Marketing': '#e8fff5', 'Data': '#fff8e8',
      'Photo·Video': '#fff0eb', 'Language': '#edf8ff',
      'Music': '#fbeaff', 'Cooking': '#fff3e0',
    };
    return cats[this.lesson.category] ?? '#f5f2fa';
  }

  onFavourite(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    const userJson = localStorage.getItem('user');
    if (!userJson) {
      alert('You need to log in to use Favourites');
      return;
    }

    const userId = JSON.parse(userJson)._id;
    const newState = !this.isFavourited;

    this.lessonService.toggleFavouriteLesson(this.lesson._id, userId).subscribe({
      next: () => {
        this.favouriteToggled.emit(this.lesson._id);
      },
      error: (err) => {
        console.error('toggle error:', err);
        alert('An error occurred while processing. Please try again.');
      }
    });
  }

  @Input() removeMode = false;
  @Output() removeRequested = new EventEmitter<string>();

  onRemove(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    const userJson = localStorage.getItem('user');
    if (!userJson) return;
    const userId = JSON.parse(userJson)._id;

    this.lessonService.toggleFavouriteLesson(this.lesson._id, userId).subscribe({
      next: () => this.removeRequested.emit(this.lesson._id),
      error: (err) => {
        console.error('remove error:', err);
        alert('An error occurred. Please try again.');
      }
    });
  }
}
