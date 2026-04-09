import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly API = 'http://localhost:3000/api/v1';
  constructor(private http: HttpClient) {}
  public refreshNeeded$ = new Subject<void>();

  getMessages(lessonId: string, userId: string) {
    return this.http.get<any[]>(`${this.API}/messages/${lessonId}?userId=${userId}`);
  }

  sendMessage(messageData: any) {
    return this.http.post<Message>(`${this.API}/messages`, messageData);
  }

  getInstructorThreads(instructorId: string){
    return this.http.get<any[]>(`${this.API}/messages/instructor/${instructorId}/threads`);
  }

  getUnreadCount(userId: string) {
    return this.http.get<{count: number}>(`${this.API}/messages/unread-count/${userId}`);
  }
  
  markAsRead(lessonId: string, userId: string) {
    return this.http.put(`${this.API}/messages/read-all`, { lessonId, userId });
  }
}
