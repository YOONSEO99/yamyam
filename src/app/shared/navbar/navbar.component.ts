import { Component, inject, OnInit, signal } from '@angular/core'; // OnInit, signal 추가
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service'; // 서비스 임포트

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit { // OnInit 구현 추가
  auth = inject(AuthService);
  private messageService = inject(MessageService); // 서비스 주입

  // 안 읽은 메시지 개수를 저장할 Signal
  unreadCount = signal<number>(0);

  ngOnInit(): void {
    this.refreshUnreadCount();

    this.messageService.refreshNeeded$.subscribe(() => {
      console.log('Navbar: reloading'); // 확인용 로그
      this.refreshUnreadCount();
    });
  }

  // 메시지 개수를 새로고침하는 함수
  refreshUnreadCount() {
    const user = this.auth.currentUser();
    if (user) {
      this.messageService.getUnreadCount(user._id).subscribe({
        next: (res) => this.unreadCount.set(res.count),
        error: (err) => console.error('Failed to get unread count', err)
      });
    }
  }
}