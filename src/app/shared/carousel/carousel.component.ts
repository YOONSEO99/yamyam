import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Slide {
  id: number;
  badge: string;
  bgClass: string;
  emoji: string;
  category: string;
  title: string;
  subtitle: string;
  cta: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnInit, OnDestroy {
  current = signal(0);
  private timer: any;

  slides: Slide[] = [
    { id: 0, badge: 'HOT THIS WEEK', bgClass: 'bg-purple', emoji: '🍇', category: 'IT · Dev', title: 'React 19 + TypeScript', subtitle: 'From zero to production-ready', cta: 'Explore Class' },
    { id: 1, badge: 'NEW ARRIVAL', bgClass: 'bg-blue', emoji: '🎨', category: 'Design', title: 'Figma UX/UI Mastery', subtitle: 'Design systems & prototyping', cta: 'Explore Class' },
    { id: 2, badge: 'BEST SELLER', bgClass: 'bg-green', emoji: '📊', category: 'Marketing', title: 'Growth Marketing', subtitle: 'Data-driven campaigns that work', cta: 'Explore Class' },
    { id: 3, badge: 'TRENDING', bgClass: 'bg-amber', emoji: '🐍', category: 'Data', title: 'Python for Data Analysis', subtitle: 'Pandas, NumPy, Matplotlib', cta: 'Explore Class' },
    { id: 4, badge: 'FEATURED', bgClass: 'bg-coral', emoji: '⚡', category: 'IT · Dev', title: 'Node.js REST API', subtitle: 'Build scalable backend systems', cta: 'Explore Class' },
  ];

  ngOnInit() {
    this.timer = setInterval(() => {
      this.current.update(c => (c + 1) % this.slides.length);
    }, 4000);
  }

  ngOnDestroy() { clearInterval(this.timer); }

  goTo(i: number) {
    this.current.set(i);
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.current.update(c => (c + 1) % this.slides.length);
    }, 4000);
  }

  prev() { this.goTo((this.current() - 1 + this.slides.length) % this.slides.length); }
  next() { this.goTo((this.current() + 1) % this.slides.length); }
}
