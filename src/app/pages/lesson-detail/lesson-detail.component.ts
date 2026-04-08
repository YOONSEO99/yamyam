import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LessonService } from '../../services/lesson.service';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';
import { Lesson } from '../../models/lesson';
import { Message } from '../../models/message';
import { User } from '../../models/user';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-lesson-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lesson-detail.component.html',
  styleUrl: './lesson-detail.component.scss'
})
export class LessonDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private lessonService = inject(LessonService);
  private messageService = inject(MessageService);
  auth = inject(AuthService);

  lesson = signal<Lesson | null>(null);
  isLoading = signal(true);

  messages = signal<Message[]>([]);
  newMessage = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.lessonService
        .getLessonById(id)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (data) => {
            this.lesson.set(data);
            console.log('success!! :: ', data._id);
          },
          error: (err) => {
            console.error('Error ::', err)
          }

        });
    }
  }

  get isOwner() {
    const inst = this.lesson()?.instructorId;
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
    this.lesson.update(l => l ? { ...l, isFavourited: !l.isFavourited } : l);
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

  isUserObject(user: any): user is User {
    return user && typeof user === 'object' && 'nickname' in user;
  }
}

