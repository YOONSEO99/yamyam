import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LessonService } from '../../services/lesson.service';

@Component({
  selector: 'app-new-lesson',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-lesson.component.html',
  styleUrl: './new-lesson.component.scss'
})
export class NewLessonComponent {
  private router = inject(Router);
  private lessonService = inject(LessonService);
  saving = signal(false);

  form = {
    title: '', description: '', category: '', status: 'draft',
    price: null, maxCapacity: null,
    startDate: '', startTime: '', endTime: '',
    streetNumber: '', streetName: '', city: '', postalCode: ''
  };

  categories = ['IT·Dev', 'Design', 'Marketing', 'Photo·Video', 'Language', 'Music', 'Cooking', 'Data'];

  submit(targetStatus: 'draft' | 'published') {
    if (!this.form.title || !this.form.category) {
      alert('Both title and category are required.');
      return;
    }

    this.form.status = targetStatus;
    this.saving.set(true);

    this.lessonService
      .createLesson({ ...this.form })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/my-lessons']),
        error: () => alert('Fail to create the lesson. Please try again.')
      });
  }
}
