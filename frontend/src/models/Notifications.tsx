export interface Notification {
  id: number;
  userId: number;
  postId: number;
  replyId: number;
  message: string;
  read: boolean;
  createdAt: string;
  username: string;
}
