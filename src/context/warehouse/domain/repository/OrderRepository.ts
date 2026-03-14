import Order from '../entity/Order';

export default interface OrderRepository {
  get(id: string): Promise<Order | null>;
  update(order: Order): Promise<Order>;
}