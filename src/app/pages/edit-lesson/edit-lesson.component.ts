import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { LessonService } from '../../services/lesson.service';
import { Lesson } from '../../models/lesson';

@Component({
  selector: 'app-edit-lesson',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-lesson.component.html',
  styleUrl: '../new-lesson/new-lesson.component.scss'
})
export class EditLessonComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private lessonService = inject(LessonService);

  lessonId = '';
  loading = signal(true);
  saving = signal(false);
  loadError = signal(false);
  saveError = signal(false);

  form = {
    title: '',
    description: '',
    category: '',
    status: 'draft' as 'draft' | 'published'
  };

  categories = ['IT·Dev', 'Design', 'Marketing', 'Photo·Video', 'Language', 'Music', 'Cooking', 'Data'];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loadError.set(true);
      this.loading.set(false);
      return;
    }
    this.lessonId = id;
    this.lessonService.getLessonById(id).subscribe({
      next: (lesson) => {
        this.patchForm(lesson);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      }
    });
  }

  private patchForm(lesson: Lesson) {
    this.form.title = lesson.title ?? '';
    this.form.description = lesson.description ?? '';
    this.form.category = lesson.category ?? '';
    const s = lesson.status ?? 'draft';
    if (s === 'draft' || s === 'published') {
      this.form.status = s;
    } else {
      this.form.status = s === 'active' ? 'published' : 'draft';
    }
  }

  submit() {
    if (!this.form.title || !this.form.category) return;
    this.saveError.set(false);
    this.saving.set(true);
    this.lessonService
      .updateLesson(this.lessonId, {
        title: this.form.title,
        description: this.form.description,
        category: this.form.category,
        status: this.form.status
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/lessons', this.lessonId]),
        error: () => this.saveError.set(true)
      });
  }
}
