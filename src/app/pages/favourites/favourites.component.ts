import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClassCardComponent } from '../../shared/class-card/class-card.component';
import { Class } from '../../models/class';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, RouterLink, ClassCardComponent],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.scss'
})
export class FavouritesComponent {
  classes = signal<Class[]>([
    { _id: '1', title: 'React 19 + TypeScript Complete Bootcamp', description: '', category: 'IT·Dev', status: 'published', creatorId: 'u1', creator: { _id: 'u1', nickname: 'MinJun Kim' }, rating: 4.9, isFavourited: true, createdAt: '', updatedAt: '' },
    { _id: '6', title: 'Angular 19 Signals & Standalone Architecture', description: '', category: 'IT·Dev', status: 'published', creatorId: 'u6', creator: { _id: 'u6', nickname: 'Jiyeon Han' }, rating: 4.8, isFavourited: true, createdAt: '', updatedAt: '' },
  ]);

  onFavouriteToggled(classId: string) {
    this.classes.update(list => list.filter(c => c._id !== classId));
  }
}
