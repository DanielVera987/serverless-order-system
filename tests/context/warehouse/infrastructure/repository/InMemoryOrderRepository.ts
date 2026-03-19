import OrderRepository from '../../../../../src/context/warehouse/domain/repository/OrderRepository';
import Order from '../../../../../src/context/warehouse/domain/entity/Order';

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[];
  private forcedError: Error | null = null;

  constructor(initialOrders: Order[] = []) {
    this.orders = [...initialOrders];
  }

  simulateFailure(error = new Error('DB connection error')): this {
    this.forcedError = error;
    return this;
  }

  private checkForError(): void {
    if (this.forcedError) throw this.forcedError;
  }

  async get(id: string): Promise<Order | null> {
    this.checkForError();
    return this.orders.find(o => o.id === id) ?? null;
  }

  async update(order: Order): Promise<Order> {
    this.checkForError();
    const index = this.orders.findIndex(o => o.id === order.id);
    if (index !== -1) this.orders[index] = order;
    return order;
  }

  getOrders(): Order[] {
    return [...this.orders];
  }
}
