import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@app/models/user';
import { UserService } from '@app/services/user.service';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  users = signal<User[]>([]);
  totalUsers = signal<number>(0);
  isLoading = signal<boolean>(false);

  filterRole = signal('');
  filterStatus = signal('');
  sortBy = signal('');

  filteredUsers = computed(() => {
    let result = [...this.users()];

    if (this.filterRole() === 'instructor') {
      result = result.filter(u => u.isInstructor);
    } else if (this.filterRole() === 'admin') {
      result = result.filter(u => u.isAdmin);
    } else if (this.filterRole() === 'user') {
      result = result.filter(u => !u.isInstructor && !u.isAdmin);
    }

    // 상태 필터
    if (this.filterStatus() === 'active') {
      result = result.filter(u => !u.deletedAt);
    } else if (this.filterStatus() === 'archived') {
      result = result.filter(u => !!u.deletedAt);
    }

    // 정렬
    if (this.sortBy() === 'name-asc') {
      result.sort((a, b) => (a.nickname || a.firstName || '').localeCompare(b.nickname || b.firstName || ''));
    } else if (this.sortBy() === 'name-desc') {
      result.sort((a, b) => (b.nickname || b.firstName || '').localeCompare(a.nickname || a.firstName || ''));
    } else if (this.sortBy() === 'role') {
      result.sort((a, b) => (a.role || '').localeCompare(b.role || ''));
    }

    return result;
  });

  applyFilters(){

  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.isLoading.set(true);
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users.set(res.users);
        this.totalUsers.set(res.total)
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Fetch failed:', err);
        this.isLoading.set(false);
      }
    });
  }

  onDeactivate(user: User) {
    if (confirm(`Deactivate ${user.nickname || user.firstName}?`)) {
      this.userService.softDeleteUser(user._id).subscribe({
        next: (updatedUser) => {
          this.users.update(prev =>
            prev.map(u => u._id === user._id ? { ...u, deletedAt: updatedUser.deletedAt } : u)
          );
          console.log('User deactivated successfully');
        },
        error: (err) => alert('Failed to deactivate user.')
      });
    }
  }

  onRestore(user: User) {
    if (confirm(`Restore ${user.nickname || user.firstName}?`)) {
      this.userService.restoreUser(user._id).subscribe({
        next: () => {
          this.users.update(prev =>
            prev.map((u: User): User => u._id === user._id ? { ...u, deletedAt: undefined } : u)
          );
          console.log('Restoring user:', user._id);
        },
        error: (err) => alert('Failed to restore user')
      });
    }
  }

  onEditUser(userId: string) {
    this.router.navigate(['/profile'], {
      queryParams: {
        id: userId,
        edit: 'true',
        fromAdmin: 'true'
      }
    });
  }
}
