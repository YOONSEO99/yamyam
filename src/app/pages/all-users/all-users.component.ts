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
    { _id: 'u1', email: 'minjun@example.com', firstName: 'MinJun', lastName: 'Kim', birthDate: '1992-03-15', nickname: 'MinJun Kim', role: 'instructor', bio: 'Senior frontend developer. React & TypeScript specialist.', createdAt: '2024-01-01' },
    { _id: 'u2', email: 'seoyeon@example.com', firstName: 'Seo-Yeon', lastName: 'Lee', birthDate: '1994-07-22', nickname: 'Seo-Yeon Lee', role: 'instructor', bio: 'Product designer at a top startup. Figma power user.', createdAt: '2024-02-01' },
    { _id: 'u3', email: 'jihoon@example.com', firstName: 'Jihoon', lastName: 'Park', birthDate: '1991-11-08', nickname: 'Jihoon Park', role: 'instructor', bio: 'Backend engineer. Node.js, MongoDB, and cloud architecture.', createdAt: '2024-02-15' },
    { _id: 'u4', email: 'hyuna@example.com', firstName: 'Hyuna', lastName: 'Choi', birthDate: '1993-05-30', nickname: 'Hyuna Choi', role: 'instructor', bio: 'Data scientist with a passion for teaching Python & ML.', createdAt: '2024-03-01' },
    { _id: 'u5', email: 'junho@example.com', firstName: 'Junho', lastName: 'Shin', birthDate: '1989-09-12', nickname: 'Junho Shin', role: 'instructor', bio: 'Growth marketer. Built campaigns for 50+ brands.', createdAt: '2024-03-10' },
    { _id: 'u6', email: 'jiyeon@example.com', firstName: 'Jiyeon', lastName: 'Han', birthDate: '1995-01-04', nickname: 'Jiyeon Han', role: 'instructor', bio: 'Angular advocate and frontend architecture enthusiast.', createdAt: '2024-04-01' },
  ]);
}
