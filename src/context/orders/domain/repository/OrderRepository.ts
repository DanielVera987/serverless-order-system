import Order from '../entity/Order';

export default interface OrderRepository {
  create(order: Order): Promise<void>;
  get(id: string): Promise<Order | null>;
  update(order: Order): Promise<void>;
  delete(id: string): Promise<void>;
}