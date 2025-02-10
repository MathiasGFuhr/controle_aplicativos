export interface Subscriber {
  id: string;
  name: string;
  expirationDate: Date;
  avatarUrl: string;
  appName: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
} 