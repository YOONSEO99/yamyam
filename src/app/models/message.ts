import { Lesson } from './lesson';
import { User } from './user';

export interface Message {
  _id: string;
  classId: string | Lesson;
  senderId: string | User;
  receiverId: string | User;
  content: string;
  createdAt: string;
}
