import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@app/models/user';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  private userService = inject(UserService);
  users = signal<User[]>([]);
  totalUsers = signal<number>(0);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(){
    this.isLoading.set(true);
    this.userService.getUsers().subscribe({
      next:(res) => {
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

  onDeactivate(user:User){
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

  onRestore(user:User){
    if(confirm(`Restore ${user.nickname||user.firstName}?`)){
      this.userService.restoreUser(user._id).subscribe({
        next:() => {
          this.users.update(prev=>
            prev.map((u:User):User=>u._id === user._id ? {...u, deletedAt: undefined}:u)
          );
          console.log('Restoring user:', user._id);
        },
        error:(err) => alert('Failed to restore user')
      });
    }
  }
}
