import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LessonCardComponent } from '../../shared/lesson-card/lesson-card.component';
import { Lesson } from '../../models/lesson';
import { LessonService } from '../../services/lesson.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, RouterLink, LessonCardComponent],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.scss'
})
export class FavouritesComponent implements OnInit {
  private lessonService = inject(LessonService);

  allFavouriteLessons = signal<Lesson[]>([]);
  isLoading = signal<boolean>(false);

  // ✅ service signal 기준으로 필터링 → 메인에서 토글해도 자동 반영
  lessons = computed(() => {
    const ids = this.lessonService.favouriteIds();
    return this.allFavouriteLessons().filter(l => ids.has(l._id));
  });

  ngOnInit(): void {
    this.loadFavourites();
  }

  loadFavourites() {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      console.error('User data not found');
      return;
    }

    try {
      const userData = JSON.parse(userJson);
      const myId = userData._id;
      if (!myId) return;

      this.isLoading.set(true);
      this.lessonService
        .getFavouriteLessons(myId)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (data) => {
            this.allFavouriteLessons.set(data);
          },
          error: (err) => console.error('Error: ', err)
        });
    } catch (e) {
      console.error('JSON parsing error:', e);
    }
  }

  // ✅ emit 타입 맞춤 - 실제로 목록 필터는 computed()가 자동 처리
  onFavouriteToggled(event: { id: string; isFavourited: boolean }) {
    // computed()가 service signal 기준으로 자동 필터링하므로 별도 처리 불필요
    // 필요 시 추가 로직 삽입 가능
  }
}