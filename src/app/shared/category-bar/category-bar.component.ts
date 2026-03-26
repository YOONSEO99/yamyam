import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-bar.component.html',
  styleUrl: './category-bar.component.scss'
})
export class CategoryBarComponent {
  @Output() categorySelected = new EventEmitter<string>();
  active = signal('All');

  categories = [
    { label: 'All', emoji: '✦' },
    { label: 'IT·Dev', emoji: '💻' },
    { label: 'Design', emoji: '🎨' },
    { label: 'Marketing', emoji: '📊' },
    { label: 'Photo·Video', emoji: '📸' },
    { label: 'Language', emoji: '📖' },
    { label: 'Music', emoji: '🎵' },
    { label: 'Cooking', emoji: '🍳' },
    { label: 'Data', emoji: '🧠' },
  ];

  select(cat: string) {
    this.active.set(cat);
    this.categorySelected.emit(cat === 'All' ? '' : cat);
  }
}
