import { Lesson } from './lesson';
import { User } from './user';

export interface Booking {
  _id: string;
  studentId: string | User;
  lessonId: string | Lesson;
  status: 'reserved' | 'pending' | 'cancelled' | 'completed';
  paymentAmount: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}





