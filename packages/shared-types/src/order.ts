export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
  REVISION = 'REVISION'
}

export interface Order {
  id: string;
  projectId: string;
  clientId: string;
  status: OrderStatus;
  totalAmount: number;
  requirements?: string | null;
  deliveryDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderInput {
  projectId: string;
  requirements?: string;
}

export interface UpdateOrderInput {
  id: string;
  status?: OrderStatus;
  requirements?: string;
}
