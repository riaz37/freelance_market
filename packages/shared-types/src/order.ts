import { OrderStatus as PrismaOrderStatus, Prisma } from '@prisma/client';

export const OrderStatus = PrismaOrderStatus;
export type OrderStatus = PrismaOrderStatus;

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
  deliveryDate?: Date;
}

export interface UpdateOrderInput {
  id: string;
  status?: OrderStatus | Prisma.EnumOrderStatusFieldUpdateOperationsInput;
  requirements?: string | Prisma.StringFieldUpdateOperationsInput | null;
  deliveryDate?: Date | Prisma.DateTimeFieldUpdateOperationsInput | null;
}
