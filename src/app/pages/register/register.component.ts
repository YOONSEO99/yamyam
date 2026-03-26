import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  form = { email: '', password: '', nickname: '', role: 'student' };
  loading = signal(false);
  error = signal('');

  submit() {
    this.error.set('');
    if (!this.form.email || !this.form.password || !this.form.nickname) {
      this.error.set('Please fill in all required fields.');
      return;
    }
    this.loading.set(true);
    this.auth.register(this.form).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.error.set('Registration failed. Email may already be in use.');
        this.loading.set(false);
      }
    });
  }
}
