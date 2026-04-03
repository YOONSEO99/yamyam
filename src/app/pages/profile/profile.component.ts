import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  editing = signal(false);
  saving = signal(false);

  form = {
    nickname: this.auth.currentUser()?.nickname ?? '',
    bio: 'Passionate learner. Always chewing on something new.',
    role: this.auth.currentUser()?.role ?? 'user',
    firstName: this.auth.currentUser()?.firstName ?? '',
    lastName: this.auth.currentUser()?.lastName ?? '',
    birthDate: this.auth.currentUser()?.birthDate ?? '',
    email: this.auth.currentUser()?.email ?? 'user@example.com',
    isInstructor : this.auth.currentUser()?.isInstructor ?? false,
    isAdmin : this.auth.currentUser()?.isAdmin ?? false,
  };

  ngOnInit(): void {
    const editMode = this.route.snapshot.queryParamMap.get('edit');
    if(editMode ==='true'){
      this.editing.set(true);
    }
  }
  getDisplayName() {
    return this.form.nickname || this.form.firstName || 'Guest User';
  }

  async save() {
    this.saving.set(true);
    
    try{
      const userId = this.auth.currentUser()?._id;

      if(!userId){
        alert("User not found")
        this.saving.set(false);
        return;
      }

      const response = await fetch(`http://localhost:3000/api/v1/auth/update/${userId}`, {
        method: 'PUT',
        headers:{
          'Content-Type' : 'application/json',
          },
        body: JSON.stringify({
          firstName:this.form.firstName,
          lastName:this.form.lastName,
          nickname: this.form.nickname,
          birthDate: this.form.birthDate,
          bio:this.form.bio,
          isInstructor: this.form.isInstructor,
        }),
      });

      const data = await response.json();

      if(response.ok){
        this.auth.currentUser.set(data.user);
        localStorage.setItem('user',JSON.stringify(data.user));
        alert("Profile updated!");
        this.editing.set(false);
      }else{
        alert(data.message || 'Failed to profile updating')
      }

    }catch(error){
      console.error('Update error', error);
      
    }finally{
      this.saving.set(false);
    }
  }
}
