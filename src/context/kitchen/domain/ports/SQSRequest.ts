export interface SQSMessageRequest {
  Orders: Order[];
}

export default interface Order {
    id: string;
    orderNumber: number;
    status: string;
    createdAt: string;
}