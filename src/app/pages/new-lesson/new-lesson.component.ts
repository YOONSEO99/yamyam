import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-lesson',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-lesson.component.html',
  styleUrl: './new-lesson.component.scss'
})
export class NewLessonComponent {
  private router = inject(Router);
  saving = signal(false);

  form = {
    title: '', description: '', category: '', status: 'draft'
  };

  categories = ['IT·Dev', 'Design', 'Marketing', 'Photo·Video', 'Language', 'Music', 'Cooking', 'Data'];

  submit() {
    if (!this.form.title || !this.form.category) return;
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.router.navigate(['/my-lessons']);
    }, 800);
  }
}
