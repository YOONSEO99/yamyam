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

  form = { 
    email: '', 
    password: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    nickname: '', 
    role: 'user' 
  };
  loading = signal(false);
  error = signal('');

  submit() {
    this.error.set('');
    if (!this.form.email || !this.form.password || !this.form.firstName || !this.form.lastName || !this.form.birthDate) {
      this.error.set('Please fill in all required fields.');
      return;
    }
    this.loading.set(true);
    this.auth.register(this.form).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        const errorMessage = err.error?.message || 'Registration failed. Please try again.';
        this.error.set(errorMessage);
        this.loading.set(false);
      }
    });
  }
}
