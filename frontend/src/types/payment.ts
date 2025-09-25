export interface Payment {
  id: string;
  status: 'approved' | 'pending' | 'rejected' | 'in_progress';
  value: number;
  customerId: string;
  createdAt: string;
  Customer?: {
    name: string;
    email: string;
  }
}
