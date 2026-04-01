import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClassService } from '../../services/class.service';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';
import { Lesson } from '../../models/lesson';
import { Message } from '../../models/message';
import { User } from '../../models/user';

@Component({
  selector: 'app-class-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './class-detail.component.html',
  styleUrl: './class-detail.component.scss'
})
export class ClassDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private classService = inject(ClassService);
  private messageService = inject(MessageService);
  auth = inject(AuthService);

  cls = signal<Lesson | null>(null);
  messages = signal<Message[]>([]);
  newMessage = '';

  mockClass: Lesson = {
    _id: '1', title: 'React 19 + TypeScript Complete Bootcamp',
    description: `This comprehensive course takes you from React fundamentals all the way to building production-ready applications with TypeScript. You'll learn the latest React 19 features including Server Components, the new use() hook, signals patterns, and the complete TypeScript integration workflow.\n\nBy the end of this course you'll be able to build, test, and deploy full React applications confidently.`,
    category: 'IT·Dev', status: 'published',
    city: 'Seoul', streetName: 'Teheran-ro', streetNumber: '123', postalCode: '06142',
    startDate: '2025-04-01', startTime: '19:00', endTime: '21:00',
    maxCapacity: 30, currentBookings: 128, price: 89000,
    instructorId: { _id: 'u1', email: 'minjun@example.com', firstName: 'MinJun', lastName: 'Kim', birthDate: '1990-01-01', nickname: 'MinJun Kim' } satisfies User,
    rating: 4.9, studentsCount: 128, isFavourited: true,
    createdAt: '2024-11-01', updatedAt: '2025-01-15'
  };

  mockMessages: Message[] = [
    { _id: 'm1', lessonId: '1', senderId: 'me', receiverId: 'u1', content: 'Hi! Is prior TypeScript experience required for this course?', isRead: true, createdAt: '2025-03-20T14:34:00Z' },
    {
      _id: 'm2', lessonId: '1',
      senderId: { _id: 'u1', email: 'minjun@example.com', firstName: 'MinJun', lastName: 'Kim', birthDate: '1990-01-01', nickname: 'MinJun Kim' } satisfies User,
      receiverId: 'me',
      content: 'Not at all! We cover TypeScript fundamentals at the start. Beginners are very welcome 😊',
      isRead: true,
      createdAt: '2025-03-20T15:01:00Z',
    },
  ];

  ngOnInit() {
    this.cls.set(this.mockClass);
    this.messages.set(this.mockMessages);
  }

  get isOwner() {
    const inst = this.cls()?.instructorId;
    const instId = typeof inst === 'string' ? inst : inst?._id;
    return this.auth.currentUser()?._id === instId;
  }

  instructorFromLesson(lesson: Lesson): User | undefined {
    const id = lesson.instructorId;
    return typeof id === 'object' ? id : undefined;
  }

  senderUser(senderId: Message['senderId']): User | undefined {
    return typeof senderId === 'object' ? senderId : undefined;
  }

  toggleFavourite() {
    this.cls.update(c => c ? { ...c, isFavourited: !c.isFavourited } : c);
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    const msg: Message = {
      _id: 'new-' + Date.now(), lessonId: '1',
      senderId: 'me', receiverId: 'u1',
      content: this.newMessage, isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.messages.update(m => [...m, msg]);
    this.newMessage = '';
  }

  formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}
