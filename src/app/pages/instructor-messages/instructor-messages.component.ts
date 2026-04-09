import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';

// 백엔드에서 묶어서 보내줄 대화방 정보 타입
export interface MessageThread {
  _id: string; // 학생의 ID
  student: { _id: string, nickname: string, email: string };
  lesson: { _id: string, title: string };
  lastMessage: string;
  updatedAt: string;
}

@Component({
  selector: 'app-instructor-messages',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './instructor-messages.component.html',
  styleUrl: './instructor-messages.component.scss'
})
export class InstructorMessagesComponent implements OnInit {
  private messageService = inject(MessageService);
  auth = inject(AuthService);

  threads = signal<MessageThread[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.fetchThreads();
  }

  fetchThreads() {
    this.isLoading.set(true);
    const uid = this.auth.currentUser()?._id;
    if (!uid) return;

    this.messageService.getInstructorThreads(uid).subscribe({
      next: (res) => {
        this.threads.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Fetch failed:', err);
        this.isLoading.set(false);
      }
    });
  }
}