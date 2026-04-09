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
    const currentUser = this.auth.currentUser();

    if (id) {
      this.lessonService
        .getLessonById(id)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (data) => {
            this.lesson.set(data);
            this.loadMessages(data._id);

            if (currentUser) {
              this.messageService.markAsRead(data._id, currentUser._id).subscribe({
                next: () => {
                  this.messageService.refreshNeeded$.next();
                }
              });
            }
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

  get isEnrolled(): boolean {
    const l = this.lesson();
    const uid = this.auth.currentUser()?._id;
    if (!l || !uid) return false;
    const ids = this.auth.currentUser()?.enrolledLessonIds ?? [];
    return ids.includes(l._id);
  }

  get canEnroll(): boolean {
    const l = this.lesson();
    if (!l || !this.auth.isLoggedIn() || this.isOwner) return false;
    if (this.isEnrolled) return false;
    const s = l.status ?? 'active';
    return s !== 'draft';
  }

  enrollPending = signal(false);

  enroll() {
    const l = this.lesson();
    const uid = this.auth.currentUser()?._id;
    if (!l || !uid || !this.canEnroll) return;
    this.enrollPending.set(true);
    this.lessonService.enrollInLesson(l._id, uid).subscribe({
      next: (res) => {
        this.auth.patchCurrentUser({ enrolledLessonIds: res.enrolledLessonIds });
        this.enrollPending.set(false);
      },
      error: (err) => {
        console.error('Enroll failed:', err);
        this.enrollPending.set(false);
      }
    });
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

  formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  isUserObject(user: any): user is User {
    return user && typeof user === 'object' && 'nickname' in user;
  }

  loadMessages(lessonId: string) {
    const currentUser = this.auth.currentUser();
    if (!currentUser) return;

    const queryStudentId = this.route.snapshot.queryParamMap.get('studentId');
    const targetUserId = (this.isOwner && queryStudentId) ? queryStudentId : currentUser._id;

    this.messageService.getMessages(lessonId, targetUserId).subscribe({
      next: (data) => this.messages.set(data),
      error: (err) => console.error('Failed to load messages : ', err)
    });
  }

  sendMessage() {
    const currentLesson = this.lesson();
    const currentUser = this.auth.currentUser();

    if (!this.newMessage.trim() || !currentLesson || !currentUser) return;
    const inst = currentLesson.instructorId;
    const instructorId = typeof inst === 'object' ? inst._id : inst;

    let targetReceiverId = instructorId;

    const queryStudentId = this.route.snapshot.queryParamMap.get('studentId');
    if (this.isOwner && queryStudentId) {
      targetReceiverId = queryStudentId;
    }
    const messageData = {
      lessonId: currentLesson._id,
      senderId: currentUser._id,
      receiverId: targetReceiverId,
      content: this.newMessage
    };

    this.messageService.sendMessage(messageData).subscribe({
      next: (savedMsg) => {
        this.messages.update(prev => [...prev, savedMsg]);
        this.newMessage = '';
      },
      error: (err) => alert('Failed to send the message!')
    });
  }

  isMyMessage(msg: Message): boolean {
    const currentUserId = this.auth.currentUser()?._id;
    if (!currentUserId) return false;

    const msgSenderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;

    return msgSenderId === currentUserId;
  }
}

