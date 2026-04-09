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
  thumbnailFile: File | null = null;
  thumbnailPreview: string | null = null;

  onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    this.setFile(file);
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    this.setFile(file);
  }

  private setFile(file: File | undefined) {
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      alert('PNG or JPG only.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be under 5MB.');
      return;
    }
    this.thumbnailFile = file;
    const reader = new FileReader();
    reader.onload = () => this.thumbnailPreview = reader.result as string;
    reader.readAsDataURL(file);
  }
}
