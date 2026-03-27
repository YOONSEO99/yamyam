import { User } from './user';

export interface Lesson {
  _id: string;
  instructorId: string | User;
  title: string;
  description: string;
  category: string;
  city: string;
  streetName: string;
  streetNumber: string;
  unitNumber?: string;
  postalCode: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentBookings: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;

}
