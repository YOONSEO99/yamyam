import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClassService } from '../../services/class.service';
import { ClassCardComponent } from '../../shared/class-card/class-card.component';
import { CategoryBarComponent } from '../../shared/category-bar/category-bar.component';
import { Class } from '../../models/class';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ClassCardComponent, CategoryBarComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private classService = inject(ClassService);

  classes = signal<Class[]>([]);
  loading = signal(false);
  searchQuery = '';
  activeCategory = '';
  totalCount = signal(0);

  mockClasses: Class[] = [
    { _id: '1', title: 'React 19 + TypeScript Complete Bootcamp', description: 'Master modern React with TypeScript, hooks, signals, and real-world projects.', category: 'IT·Dev', status: 'published', creatorId: 'u1', creator: { _id: 'u1', nickname: 'MinJun Kim' }, rating: 4.9, studentsCount: 128, isFavourited: true, createdAt: '', updatedAt: '' },
    { _id: '2', title: 'Figma UX/UI Design from Zero to Hero', description: 'Learn Figma from scratch and build professional-grade UI design systems.', category: 'Design', status: 'published', creatorId: 'u2', creator: { _id: 'u2', nickname: 'Seo-Yeon Lee' }, rating: 4.8, studentsCount: 94, isFavourited: false, createdAt: '', updatedAt: '' },
    { _id: '3', title: 'Node.js REST API — Build & Deploy', description: 'Build scalable RESTful APIs with Node.js, Express, and MongoDB.', category: 'IT·Dev', status: 'published', creatorId: 'u3', creator: { _id: 'u3', nickname: 'Jihoon Park' }, rating: 4.9, studentsCount: 112, isFavourited: false, createdAt: '', updatedAt: '' },
    { _id: '4', title: 'Python for Data Analysis & Visualization', description: 'Analyze data with Pandas, NumPy, and create stunning Matplotlib charts.', category: 'Data', status: 'published', creatorId: 'u4', creator: { _id: 'u4', nickname: 'Hyuna Choi' }, rating: 4.7, studentsCount: 87, isFavourited: false, createdAt: '', updatedAt: '' },
    { _id: '5', title: 'Growth Marketing: Data-Driven Campaigns', description: 'Learn performance marketing, A/B testing, and analytics tools.', category: 'Marketing', status: 'published', creatorId: 'u5', creator: { _id: 'u5', nickname: 'Junho Shin' }, rating: 4.6, studentsCount: 73, isFavourited: false, createdAt: '', updatedAt: '' },
    { _id: '6', title: 'Angular 19 Signals & Standalone Architecture', description: 'Build modern Angular apps using signals, standalone components, and best practices.', category: 'IT·Dev', status: 'published', creatorId: 'u6', creator: { _id: 'u6', nickname: 'Jiyeon Han' }, rating: 4.8, studentsCount: 65, isFavourited: true, createdAt: '', updatedAt: '' },
    { _id: '7', title: 'Adobe Premiere Pro for Content Creators', description: 'Edit professional videos and build a YouTube/Instagram workflow.', category: 'Photo·Video', status: 'published', creatorId: 'u7', creator: { _id: 'u7', nickname: 'Sungmin Oh' }, rating: 4.7, studentsCount: 58, isFavourited: false, createdAt: '', updatedAt: '' },
    { _id: '8', title: 'Business English Fluency in 30 Days', description: 'Communicate confidently in meetings, emails, and presentations.', category: 'Language', status: 'published', creatorId: 'u8', creator: { _id: 'u8', nickname: 'Rachel Kim' }, rating: 4.9, studentsCount: 201, isFavourited: false, createdAt: '', updatedAt: '' },
    { _id: '9', title: 'MongoDB Schema Design & Aggregation', description: 'Design efficient MongoDB schemas and master the aggregation pipeline.', category: 'IT·Dev', status: 'published', creatorId: 'u9', creator: { _id: 'u9', nickname: 'Taehoon Yoo' }, rating: 4.6, studentsCount: 44, isFavourited: false, createdAt: '', updatedAt: '' },
    { _id: '10', title: 'Branding & Logo Design with Illustrator', description: 'Create memorable brand identities from concept to final delivery.', category: 'Design', status: 'published', creatorId: 'u10', creator: { _id: 'u10', nickname: 'Dana Cho' }, rating: 4.7, studentsCount: 61, isFavourited: false, createdAt: '', updatedAt: '' },
    { _id: '11', title: 'Japanese for Beginners — N5 to N4', description: 'Start speaking Japanese from day one with structured grammar and vocabulary.', category: 'Language', status: 'published', creatorId: 'u11', creator: { _id: 'u11', nickname: 'Yuki Tanaka' }, rating: 4.8, studentsCount: 155, isFavourited: false, createdAt: '', updatedAt: '' },
    { _id: '12', title: 'Electric Guitar — Rock Foundations', description: 'Learn chords, scales, and your first 10 songs on electric guitar.', category: 'Music', status: 'published', creatorId: 'u12', creator: { _id: 'u12', nickname: 'Woo-jin Bae' }, rating: 4.9, studentsCount: 82, isFavourited: false, createdAt: '', updatedAt: '' },
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] ?? '';
      this.activeCategory = params['category'] ?? '';
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = [...this.mockClasses];
    if (this.activeCategory) filtered = filtered.filter(c => c.category === this.activeCategory);
    if (this.searchQuery) filtered = filtered.filter(c => c.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
    this.classes.set(filtered);
    this.totalCount.set(filtered.length);
  }

  onSearch() { this.applyFilters(); }

  onCategorySelected(cat: string) {
    this.activeCategory = cat;
    this.applyFilters();
  }

  onFavouriteToggled(classId: string) {
    this.classes.update(list =>
      list.map(c => c._id === classId ? { ...c, isFavourited: !c.isFavourited } : c)
    );
  }
}
