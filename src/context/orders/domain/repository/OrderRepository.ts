import Order from '../entity/Order';
import { PaginatedResult } from '../../../shared/domain/database/PaginatedResult';
import GetOrdersRequest from '../ports/GetOrdersRequest';

export default interface OrderRepository {
  create(order: Order): Promise<Order>;
  createBulk(orders: Order[]): Promise<Order[]>;
  get(id: string): Promise<Order | null>;
  getAll(params?: GetOrdersRequest): Promise<PaginatedResult<Order>>;
  count(params?: GetOrdersRequest): Promise<number>;
  update(order: Order): Promise<Order>;
  delete(id: string): Promise<void>;
  getNextOrderNumber(count: number): Promise<number>;
}