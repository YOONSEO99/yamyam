export interface Message {
  _id: string;
  classId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: { _id: string; nickname: string; avatarUrl?: string };
}
