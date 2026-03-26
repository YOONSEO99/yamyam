import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Class } from '../../models/class';

@Component({
  selector: 'app-class-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './class-card.component.html',
  styleUrl: './class-card.component.scss'
})
export class ClassCardComponent {
  @Input() class!: Class;
  @Output() favouriteToggled = new EventEmitter<string>();

  get initials() {
    return this.class.creator?.nickname?.charAt(0)?.toUpperCase() ?? '?';
  }

  get thumbBg() {
    const cats: Record<string, string> = {
      'IT·Dev': '#f0ebfa', 'Design': '#e8f0ff',
      'Marketing': '#e8fff5', 'Data': '#fff8e8',
      'Photo·Video': '#fff0eb', 'Language': '#edf8ff',
      'Music': '#fbeaff', 'Cooking': '#fff3e0',
    };
    return cats[this.class.category] ?? '#f5f2fa';
  }

  onFavourite(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.favouriteToggled.emit(this.class._id);
  }
}
