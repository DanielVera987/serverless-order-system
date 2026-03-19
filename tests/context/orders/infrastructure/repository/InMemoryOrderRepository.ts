import Order from "../../../../../src/context/orders/domain/entity/Order";
import GetOrdersRequest from "../../../../../src/context/orders/domain/ports/GetOrdersRequest";
import OrderRepository from "../../../../../src/context/orders/domain/repository/OrderRepository";
import { PaginatedResult } from "../../../../../src/context/shared/domain/database/PaginatedResult";

export default class InMemoryOrderRepository implements OrderRepository {
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

  async create(order: Order): Promise<Order> {
    this.checkForError();
    this.orders.push(order);
    return order;
  }

  async createBulk(orders: Order[]): Promise<Order[]> {
    this.checkForError();
    this.orders.push(...orders);
    return orders;
  }

  async get(id: string): Promise<Order | null> {
    this.checkForError();
    return this.orders.find(order => order.id === id) ?? null;
  }

  async getAll(params?: GetOrdersRequest): Promise<PaginatedResult<Order>> {
    this.checkForError();
    let filteredOrders = this.orders.filter(order =>
      params?.status ? order.status === params.status : true
    );

    if (params?.limit) {
      filteredOrders = filteredOrders.slice(0, params.limit);
    }

    return {
      items: filteredOrders,
      total: filteredOrders.length,
      nextToken: filteredOrders.length < this.orders.length ? filteredOrders[filteredOrders.length - 1].id : null,
    };
  }

  async count(params?: GetOrdersRequest): Promise<number> {
    this.checkForError();
    return this.orders.filter(order =>
      params?.status ? order.status === params.status : true
    ).length;
  }

  async update(order: Order): Promise<Order> {
    this.checkForError();
    const index = this.orders.findIndex(o => o.id === order.id);
    if (index !== -1) this.orders[index] = order;
    return order;
  }

  async delete(id: string): Promise<void> {
    this.checkForError();
    this.orders = this.orders.filter(order => order.id !== id);
  }

  async getNextOrderNumber(count: number): Promise<number> {
    this.checkForError();
    return this.orders.length + count;
  }
}
