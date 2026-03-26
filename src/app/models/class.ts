export interface Class {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
  status: 'draft' | 'published';
  creatorId: string;
  creator?: { _id: string; nickname: string; avatarUrl?: string };
  rating?: number;
  studentsCount?: number;
  favouriteCount?: number;
  isFavourited?: boolean;
  createdAt: string;
  updatedAt: string;
}
