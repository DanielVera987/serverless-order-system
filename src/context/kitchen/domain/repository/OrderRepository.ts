import Order from "../entity/Order";

export default interface OrderRepository {
  update(order: Order): Promise<Order>;
}