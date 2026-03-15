import Order from '../entity/Order';

export default interface OrderRepository {
  create(order: Order): Promise<Order>;
  createBulk(orders: Order[]): Promise<Order[]>;
  get(id: string): Promise<Order | null>;
  getAll(filters?: Record<any, any>): Promise<Order[]>;
  update(order: Order): Promise<Order>;
  delete(id: string): Promise<void>;
}