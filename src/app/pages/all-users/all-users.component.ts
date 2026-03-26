import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { User } from '../../models/user';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss'
})
export class AllUsersComponent {
  users = signal<User[]>([
    { _id: 'u1', email: 'minjun@example.com', nickname: 'MinJun Kim', role: 'instructor', bio: 'Senior frontend developer. React & TypeScript specialist.', createdAt: '2024-01-01' },
    { _id: 'u2', email: 'seoyeon@example.com', nickname: 'Seo-Yeon Lee', role: 'instructor', bio: 'Product designer at a top startup. Figma power user.', createdAt: '2024-02-01' },
    { _id: 'u3', email: 'jihoon@example.com', nickname: 'Jihoon Park', role: 'instructor', bio: 'Backend engineer. Node.js, MongoDB, and cloud architecture.', createdAt: '2024-02-15' },
    { _id: 'u4', email: 'hyuna@example.com', nickname: 'Hyuna Choi', role: 'instructor', bio: 'Data scientist with a passion for teaching Python & ML.', createdAt: '2024-03-01' },
    { _id: 'u5', email: 'junho@example.com', nickname: 'Junho Shin', role: 'instructor', bio: 'Growth marketer. Built campaigns for 50+ brands.', createdAt: '2024-03-10' },
    { _id: 'u6', email: 'jiyeon@example.com', nickname: 'Jiyeon Han', role: 'instructor', bio: 'Angular advocate and frontend architecture enthusiast.', createdAt: '2024-04-01' },
  ]);
}
