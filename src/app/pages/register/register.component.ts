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

  private calculateAge(birthDate: string): number {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  submit() {
    this.error.set('');

    if (!this.form.email || !this.form.password || !this.form.firstName || !this.form.lastName || !this.form.birthDate) {
      this.error.set('Please fill in all required fields.');
      return;
    }

    if (this.form.firstName.length < 2 || this.form.lastName.length < 2) {
      this.error.set('First and Last name must be at least 2 characters long.');
      return;
    }

    const age = this.calculateAge(this.form.birthDate);
    if (age < 13 || age > 120) {
      this.error.set('You must be between 13 and 120 years old to register.');
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
