import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  auth = inject(AuthService);
  editing = signal(false);
  saving = signal(false);

  form = {
    nickname: this.auth.currentUser()?.nickname ?? 'Guest User',
    bio: 'Passionate learner and full-stack developer. Always chewing on something new.',
    email: this.auth.currentUser()?.email ?? 'user@example.com',
  };

  save() {
    this.saving.set(true);
    setTimeout(() => { this.saving.set(false); this.editing.set(false); }, 700);
  }
}
