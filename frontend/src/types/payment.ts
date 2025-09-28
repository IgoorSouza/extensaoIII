export interface Payment {
  id: string;
  status: 'approved' | 'pending' | 'rejected' | 'in_progress';
  value: number;
  copyPasteCode: string;
  qrCode: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
  Customer?: {
    name: string;
    email: string;
  }
}
