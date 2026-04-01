import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClassService } from '../../services/class.service';
import { ClassCardComponent } from '../../shared/class-card/class-card.component';
import { CategoryBarComponent } from '../../shared/category-bar/category-bar.component';
import { Lesson } from '../../models/lesson';
import { lessonMock } from '../../data/lesson-mock';

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

  classes = signal<Lesson[]>([]);
  loading = signal(false);
  searchQuery = '';
  activeCategory = '';
  totalCount = signal(0);

  mockClasses: Lesson[] = [
    lessonMock({ _id: '1', title: 'React 19 + TypeScript Complete Bootcamp', description: 'Master modern React with TypeScript, hooks, signals, and real-world projects.', category: 'IT·Dev', isFavourited: true, instructorId: 'u1', instructorNickname: 'MinJun Kim', rating: 4.9, studentsCount: 128, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '2', title: 'Figma UX/UI Design from Zero to Hero', description: 'Learn Figma from scratch and build professional-grade UI design systems.', category: 'Design', isFavourited: false, instructorId: 'u2', instructorNickname: 'Seo-Yeon Lee', rating: 4.8, studentsCount: 94, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '3', title: 'Node.js REST API — Build & Deploy', description: 'Build scalable RESTful APIs with Node.js, Express, and MongoDB.', category: 'IT·Dev', isFavourited: false, instructorId: 'u3', instructorNickname: 'Jihoon Park', rating: 4.9, studentsCount: 112, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '4', title: 'Python for Data Analysis & Visualization', description: 'Analyze data with Pandas, NumPy, and create stunning Matplotlib charts.', category: 'Data', isFavourited: false, instructorId: 'u4', instructorNickname: 'Hyuna Choi', rating: 4.7, studentsCount: 87, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '5', title: 'Growth Marketing: Data-Driven Campaigns', description: 'Learn performance marketing, A/B testing, and analytics tools.', category: 'Marketing', isFavourited: false, instructorId: 'u5', instructorNickname: 'Junho Shin', rating: 4.6, studentsCount: 73, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '6', title: 'Angular 19 Signals & Standalone Architecture', description: 'Build modern Angular apps using signals, standalone components, and best practices.', category: 'IT·Dev', isFavourited: true, instructorId: 'u6', instructorNickname: 'Jiyeon Han', rating: 4.8, studentsCount: 65, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '7', title: 'Adobe Premiere Pro for Content Creators', description: 'Edit professional videos and build a YouTube/Instagram workflow.', category: 'Photo·Video', isFavourited: false, instructorId: 'u7', instructorNickname: 'Sungmin Oh', rating: 4.7, studentsCount: 58, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '8', title: 'Business English Fluency in 30 Days', description: 'Communicate confidently in meetings, emails, and presentations.', category: 'Language', isFavourited: false, instructorId: 'u8', instructorNickname: 'Rachel Kim', rating: 4.9, studentsCount: 201, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '9', title: 'MongoDB Schema Design & Aggregation', description: 'Design efficient MongoDB schemas and master the aggregation pipeline.', category: 'IT·Dev', isFavourited: false, instructorId: 'u9', instructorNickname: 'Taehoon Yoo', rating: 4.6, studentsCount: 44, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '10', title: 'Branding & Logo Design with Illustrator', description: 'Create memorable brand identities from concept to final delivery.', category: 'Design', isFavourited: false, instructorId: 'u10', instructorNickname: 'Dana Cho', rating: 4.7, studentsCount: 61, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '11', title: 'Japanese for Beginners — N5 to N4', description: 'Start speaking Japanese from day one with structured grammar and vocabulary.', category: 'Language', isFavourited: false, instructorId: 'u11', instructorNickname: 'Yuki Tanaka', rating: 4.8, studentsCount: 155, createdAt: '', updatedAt: '' }),
    lessonMock({ _id: '12', title: 'Electric Guitar — Rock Foundations', description: 'Learn chords, scales, and your first 10 songs on electric guitar.', category: 'Music', isFavourited: false, instructorId: 'u12', instructorNickname: 'Woo-jin Bae', rating: 4.9, studentsCount: 82, createdAt: '', updatedAt: '' }),
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
