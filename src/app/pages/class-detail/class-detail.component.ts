import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClassService } from '../../services/class.service';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';
import { Class } from '../../models/lesson';
import { Message } from '../../models/message';

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

  cls = signal<Class | null>(null);
  messages = signal<Message[]>([]);
  newMessage = '';

  mockClass: Class = {
    _id: '1', title: 'React 19 + TypeScript Complete Bootcamp',
    description: `This comprehensive course takes you from React fundamentals all the way to building production-ready applications with TypeScript. You'll learn the latest React 19 features including Server Components, the new use() hook, signals patterns, and the complete TypeScript integration workflow.\n\nBy the end of this course you'll be able to build, test, and deploy full React applications confidently.`,
    category: 'IT·Dev', status: 'published', creatorId: 'u1',
    creator: { _id: 'u1', nickname: 'MinJun Kim' },
    rating: 4.9, studentsCount: 128, isFavourited: true,
    createdAt: '2024-11-01', updatedAt: '2025-01-15'
  };

  mockMessages: Message[] = [
    { _id: 'm1', classId: '1', senderId: 'me', receiverId: 'u1', content: 'Hi! Is prior TypeScript experience required for this course?', isRead: true, createdAt: '2025-03-20T14:34:00Z', sender: { _id: 'me', nickname: 'You' } },
    { _id: 'm2', classId: '1', senderId: 'u1', receiverId: 'me', content: 'Not at all! We cover TypeScript fundamentals at the start. Beginners are very welcome 😊', isRead: true, createdAt: '2025-03-20T15:01:00Z', sender: { _id: 'u1', nickname: 'MinJun Kim' } },
  ];

  ngOnInit() {
    this.cls.set(this.mockClass);
    this.messages.set(this.mockMessages);
  }

  get isOwner() {
    return this.auth.currentUser()?._id === this.cls()?.creatorId;
  }

  toggleFavourite() {
    this.cls.update(c => c ? { ...c, isFavourited: !c.isFavourited } : c);
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    const msg: Message = {
      _id: 'new-' + Date.now(), classId: '1',
      senderId: 'me', receiverId: 'u1',
      content: this.newMessage, isRead: false,
      createdAt: new Date().toISOString(),
      sender: { _id: 'me', nickname: 'You' }
    };
    this.messages.update(m => [...m, msg]);
    this.newMessage = '';
  }

  formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}
