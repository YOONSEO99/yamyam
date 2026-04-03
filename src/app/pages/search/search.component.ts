import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LessonService } from '../../services/lesson.service';
import { LessonCardComponent } from '../../shared/lesson-card/lesson-card.component';
import { CategoryBarComponent } from '../../shared/category-bar/category-bar.component';
import { Lesson } from '../../models/lesson';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, LessonCardComponent, CategoryBarComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private lessonService = inject(LessonService);

  lessons = signal<Lesson[]>([]);
  allLessons: Lesson[] = [];
  loading = signal(false);
  totalCount = signal(0);

  searchQuery = '';
  activeCategory = '';

  ngOnInit() {
    this.loadLessons();

    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] ?? '';
      this.activeCategory = params['category'] ?? '';
      this.applyFilters();
    });
  }


  loadLessons() {
    this.loading.set(true);
    this.lessonService.getLessons()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => {
          this.allLessons = data;
          this.applyFilters();
        },
        error: (err) => {
          console.error('Failed to fetch lessons from database:', err);
        }
      });
  }


  applyFilters() {
    let filtered = [...this.allLessons];

    if (this.activeCategory && this.activeCategory !== 'All') {
      filtered = filtered.filter(l => l.category === this.activeCategory);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(l =>
        l.title.toLowerCase().includes(query) ||
        l.description?.toLowerCase().includes(query)
      );
    }

    this.lessons.set(filtered);
    this.totalCount.set(filtered.length);
  }

  onSearch() {
    this.applyFilters();
  }

  onCategorySelected(cat: string) {
    this.activeCategory = cat;
    this.applyFilters();
  }

  onFavouriteToggled(lessonId: string) {
    this.lessons.update(list =>
      list.map(l => l._id === lessonId ? { ...l, isFavourited: !l.isFavourited } : l)
    );


  }
}