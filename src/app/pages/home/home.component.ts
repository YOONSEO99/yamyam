import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClassService } from '../../services/class.service';
import { CarouselComponent } from '../../shared/carousel/carousel.component';
import { CategoryBarComponent } from '../../shared/category-bar/category-bar.component';
import { ClassCardComponent } from '../../shared/class-card/class-card.component';
import { Lesson } from '../../models/lesson';
import { lessonMock } from '../../data/lesson-mock';

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

  classes = signal<Lesson[]>([]);
  loading = signal(false);
  searchQuery = '';

  mockClasses: Lesson[] = [
    lessonMock({ _id: '1', title: 'React 19 + TypeScript Complete Bootcamp', description: '', category: 'IT·Dev', isFavourited: true, instructorId: 'u1', instructorNickname: 'MinJun Kim', rating: 4.9, studentsCount: 128, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '2', title: 'Figma UX/UI Design from Zero to Hero', description: '', category: 'Design', isFavourited: false, instructorId: 'u2', instructorNickname: 'Seo-Yeon Lee', rating: 4.8, studentsCount: 94, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '3', title: 'Node.js REST API — Build & Deploy', description: '', category: 'IT·Dev', isFavourited: false, instructorId: 'u3', instructorNickname: 'Jihoon Park', rating: 4.9, studentsCount: 112, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '4', title: 'Python for Data Analysis & Visualization', description: '', category: 'Data', isFavourited: false, instructorId: 'u4', instructorNickname: 'Hyuna Choi', rating: 4.7, studentsCount: 87, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '5', title: 'Growth Marketing: Data-Driven Campaigns', description: '', category: 'Marketing', isFavourited: false, instructorId: 'u5', instructorNickname: 'Junho Shin', rating: 4.6, studentsCount: 73, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '6', title: 'Angular 19 — Signals & Standalone Architecture', description: '', category: 'IT·Dev', isFavourited: true, instructorId: 'u6', instructorNickname: 'Jiyeon Han', rating: 4.8, studentsCount: 65, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '7', title: 'Adobe Premiere Pro for Content Creators', description: '', category: 'Photo·Video', isFavourited: false, instructorId: 'u7', instructorNickname: 'Sungmin Oh', rating: 4.7, studentsCount: 58, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '8', title: 'Business English: Fluency in 30 Days', description: '', category: 'Language', isFavourited: false, instructorId: 'u8', instructorNickname: 'Rachel Kim', rating: 4.9, studentsCount: 201, createdAt: '', updatedAt: '' }),
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
