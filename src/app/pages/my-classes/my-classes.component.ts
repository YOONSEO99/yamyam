import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Class } from '../../models/class';

@Component({
  selector: 'app-my-classes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-classes.component.html',
  styleUrl: './my-classes.component.scss'
})
export class MyClassesComponent {
  activeTab = signal<'classes' | 'favourites' | 'messages'>('classes');

  stats = { classes: 3, students: 254, favourites: 42 };

  myClasses: Class[] = [
    { _id: '1', title: 'React 19 + TypeScript Complete Bootcamp', description: '', category: 'IT·Dev', status: 'published', creatorId: 'u1', studentsCount: 128, rating: 4.9, createdAt: '2024-11-01', updatedAt: '2025-01-15' },
    { _id: '3', title: 'Node.js REST API — Build & Deploy', description: '', category: 'IT·Dev', status: 'published', creatorId: 'u1', studentsCount: 98, rating: 4.9, createdAt: '2024-09-10', updatedAt: '2025-02-01' },
    { _id: '9', title: 'MongoDB Schema Design & Aggregation', description: '', category: 'IT·Dev', status: 'draft', creatorId: 'u1', studentsCount: 0, createdAt: '2025-03-01', updatedAt: '2025-03-01' },
  ];
}
