import { Lesson } from '../models/lesson';
import { User } from '../models/user';

const VENUE: Pick<
  Lesson,
  | 'city'
  | 'streetName'
  | 'streetNumber'
  | 'postalCode'
  | 'startDate'
  | 'startTime'
  | 'endTime'
  | 'maxCapacity'
  | 'price'
> = {
  city: 'Seoul',
  streetName: 'Teheran-ro',
  streetNumber: '1',
  postalCode: '06142',
  startDate: '2025-01-01',
  startTime: '19:00',
  endTime: '21:00',
  maxCapacity: 200,
  price: 49000,
};

export function mockInstructor(userId: string, displayName: string): User {
  const parts = displayName.trim().split(/\s+/);
  const firstName = parts[0] ?? displayName;
  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : 'Instructor';
  return {
    _id: userId,
    email: `${userId}@example.com`,
    firstName,
    lastName,
    birthDate: '1990-01-01',
    nickname: displayName,
  };
}

export function lessonMock(opts: {
  _id: string;
  title: string;
  description: string;
  category: string;
  isFavourited: boolean;
  instructorId: string;
  instructorNickname: string;
  rating?: number;
  studentsCount?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}): Lesson {
  const bookings = opts.studentsCount ?? 0;
  return {
    ...VENUE,
    _id: opts._id,
    title: opts.title,
    description: opts.description,
    category: opts.category,
    isFavourited: opts.isFavourited,
    status: opts.status ?? 'published',
    rating: opts.rating,
    studentsCount: opts.studentsCount,
    currentBookings: bookings,
    instructorId: mockInstructor(opts.instructorId, opts.instructorNickname),
    createdAt: opts.createdAt,
    updatedAt: opts.updatedAt,
  };
}
