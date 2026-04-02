import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LessonService } from '../../services/lesson.service';
import { CarouselComponent } from '../../shared/carousel/carousel.component';
import { CategoryBarComponent } from '../../shared/category-bar/category-bar.component';
import { LessonCardComponent } from '../../shared/lesson-card/lesson-card.component';
import { Lesson } from '../../models/lesson';
import { lessonMock } from '../../data/lesson-mock';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CarouselComponent, CategoryBarComponent, LessonCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private lessonService = inject(LessonService);
  private router = inject(Router);

  lessons = signal<Lesson[]>([]);
  loading = signal(false);
  searchQuery = '';


  ngOnInit() {
    this.fetchLessons();
  }

  fetchLessons() {
    this.loading.set(true);
    this.lessonService.getLessons().subscribe({
      next: (data) => {
        this.lessons.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.loading.set(false);
      }
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  onCategorySelected(cat: string) {
    this.router.navigate(['/search'], { queryParams: { category: cat } });
  }

  onFavouriteToggled(lessonId: string) {
    this.lessons.update(list =>
      list.map(l => l._id === lessonId ? { ...l, isFavourited: !l.isFavourited } : l)
    );
  }
}
