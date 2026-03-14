export interface SQSMessageRequest {
  Orders: Order[];
}

export default interface Order {
    id: string;
    status: string;
    createdAt: string;
}