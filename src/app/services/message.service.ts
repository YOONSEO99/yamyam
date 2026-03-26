import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly API = 'http://localhost:3000/api/v1';
  constructor(private http: HttpClient) {}

  getMessages(classId: string) {
    return this.http.get<Message[]>(`${this.API}/messages/${classId}`);
  }

  sendMessage(classId: string, content: string) {
    return this.http.post<Message>(`${this.API}/messages/${classId}`, { content });
  }
}
