import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClassService } from '../../services/class.service';
import { CarouselComponent } from '../../shared/carousel/carousel.component';
import { CategoryBarComponent } from '../../shared/category-bar/category-bar.component';
import { ClassCardComponent } from '../../shared/class-card/class-card.component';
import { Class } from '../../models/lesson';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CarouselComponent, CategoryBarComponent, ClassCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private classService = inject(ClassService);
  private router = inject(Router);

  classes = signal<Class[]>([]);
  loading = signal(false);
  searchQuery = '';

  mockClasses: Class[] = [
    { _id: '1', title: 'React 19 + TypeScript Complete Bootcamp', description: '', category: 'IT·Dev', status: 'published', creatorId: 'u1', creator: { _id: 'u1', nickname: 'MinJun Kim' }, rating: 4.9, studentsCount: 128, isFavourited: true, createdAt: '', updatedAt: '' },
    { _id: '2', title: 'Figma UX/UI Design from Zero to Hero', description: '', category: 'Design', status: 'published', creatorId: 'u2', creator: { _id: 'u2', nickname: 'Seo-Yeon Lee' }, rating: 4.8, studentsCount: 94, isFavourited: false, createdAt: '', updatedAt: '' },
    { _id: '3', title: 'Node.js REST API — Build & Deploy', description: '', category: 'IT·Dev', status: 'published', creatorId: 'u3', creator: { _id: 'u3', nickname: 'Jihoon Park' }, rating: 4.9, studentsCount: 112, isFavourited: false, createdAt: '', updatedAt: '' },
    { _id: '4', title: 'Python for Data Analysis & Visualization', description: '', category: 'Data', status: 'published', creatorId: 'u4', creator: { _id: 'u4', nickname: 'Hyuna Choi' }, rating: 4.7, studentsCount: 87, isFavourited: false, createdAt: '', updatedAt: '' },
    { _id: '5', title: 'Growth Marketing: Data-Driven Campaigns', description: '', category: 'Marketing', status: 'published', creatorId: 'u5', creator: { _id: 'u5', nickname: 'Junho Shin' }, rating: 4.6, studentsCount: 73, isFavourited: false, createdAt: '', updatedAt: '' },
    { _id: '6', title: 'Angular 19 — Signals & Standalone Architecture', description: '', category: 'IT·Dev', status: 'published', creatorId: 'u6', creator: { _id: 'u6', nickname: 'Jiyeon Han' }, rating: 4.8, studentsCount: 65, isFavourited: true, createdAt: '', updatedAt: '' },
    { _id: '7', title: 'Adobe Premiere Pro for Content Creators', description: '', category: 'Photo·Video', status: 'published', creatorId: 'u7', creator: { _id: 'u7', nickname: 'Sungmin Oh' }, rating: 4.7, studentsCount: 58, isFavourited: false, createdAt: '', updatedAt: '' },
    { _id: '8', title: 'Business English: Fluency in 30 Days', description: '', category: 'Language', status: 'published', creatorId: 'u8', creator: { _id: 'u8', nickname: 'Rachel Kim' }, rating: 4.9, studentsCount: 201, isFavourited: false, createdAt: '', updatedAt: '' },
  ];

  ngOnInit() {
    this.classes.set(this.mockClasses);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  onCategorySelected(cat: string) {
    this.router.navigate(['/search'], { queryParams: { category: cat } });
  }

  onFavouriteToggled(classId: string) {
    this.classes.update(list =>
      list.map(c => c._id === classId ? { ...c, isFavourited: !c.isFavourited } : c)
    );
  }
}
