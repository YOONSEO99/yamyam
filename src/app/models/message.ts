import { Lesson } from './lesson';
import { User } from './user';

export interface Message {
  _id: string;
  lessonId: string | Lesson;
  senderId: string | User;
  receiverId: string | User;
  content: string;
  createdAt: string;
  isRead?: boolean;
}
