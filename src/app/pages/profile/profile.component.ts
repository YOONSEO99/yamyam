import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  editing = signal(false);
  saving = signal(false);
  confirmPassword = signal('');
  private router = inject(Router);
  targetUserId = signal<string | null>(null);

  form = {
    nickname: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    bio: '',
    isInstructor: false,
    isAdmin: false,
    role: 'user'
  };

  ngOnInit(): void {
    const editMode = this.route.snapshot.queryParamMap.get('edit');
    const idParam = this.route.snapshot.queryParamMap.get('id');
    if (editMode === 'true') {
      this.editing.set(true);
    }

    if (idParam && this.auth.currentUser()?.isAdmin) {
      this.targetUserId.set(idParam);
      this.loadTargetUserProfile(idParam);
    } else {
      const user = this.auth.currentUser();
      if (user) {
        this.fillForm(user);
      }
    }
  }

  fillForm(userData: any) {
    this.form = {
      nickname: userData.nickname || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      birthDate: userData.birthDate || '',
      email: userData.email || '',
      bio: userData.bio || 'Passionate learner. Always chewing on something new.',
      isInstructor: userData.isInstructor || false,
      isAdmin: userData.isAdmin || false,
      role: userData.role || 'user'
    };

  }

  getDisplayName() {
    return this.form.nickname || this.form.firstName || 'Guest User';
  }

  private calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  async save() {

    const userId = this.targetUserId() || this.auth.currentUser()?._id;

    if (this.form.firstName.length < 2 || this.form.lastName.length < 2) {
      alert('First and Last name must be at least 2 characters long.');
      return;
    }

    const age = this.calculateAge(this.form.birthDate);
    if (age < 13 || age > 120) {
      alert('Age must be between 13 and 120 years old.');
      return;
    }

    const isEditingOther = !!this.targetUserId();
    if (!isEditingOther && !this.confirmPassword()) {
      alert('please enter your password to confirm changes.');
      return;
    }

    this.saving.set(true);

    try {

      if (!userId) {
        alert("User not found")
        this.saving.set(false);
        return;
      }

      const response = await fetch(`http://localhost:3000/api/v1/auth/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          nickname: this.form.nickname,
          birthDate: this.form.birthDate,
          bio: this.form.bio,
          isInstructor: this.form.isInstructor,
          confirmPassword: this.confirmPassword()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        this.confirmPassword.set('');

        if (userId === this.auth.currentUser()?._id) {
          this.auth.currentUser.set(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        alert("Profile updated!");

        const fromAdmin = this.route.snapshot.queryParamMap.get('fromAdmin');
        if (fromAdmin === 'true') {
          this.router.navigate(['/admin/users']);
        } else {
          this.editing.set(false);
        }
      } else {
        alert(data.message || 'Failed to profile updating')
      }

    } catch (error) {
      console.error('Update error', error);

    } finally {
      this.saving.set(false);
    }
  }

  async loadTargetUserProfile(userId: string) {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/auth/user/${userId}`);
      const data = await response.json();
      console.log('loaded user data:', data);

      if (response.ok && data.user) {
        this.fillForm(data.user);
      } else {
        alert("Failed to load user profile");
      }

    } catch (err) {
      console.log("Error loading target user:", err);
    }
  }
}
