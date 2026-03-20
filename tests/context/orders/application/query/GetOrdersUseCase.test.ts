import Order from "../../../../../src/context/orders/domain/entity/Order";
import InMemoryOrderRepository from "../../infrastructure/repository/InMemoryOrderRepository";
import GetOrdersUseCase from "../../../../../src/context/orders/application/query/GetOrdersUseCase";

describe('GetOrdersUseCase', () => {
  describe('execute', () => {
    it('should return the list of orders from the repository', async () => {
      // Arrange
      const orders: Order[] = [
        { id: '1', orderNumber: 1, status: 'pending', createdAt: new Date().toISOString() },
      ];
      const repo = new InMemoryOrderRepository(orders);
      const useCase = new GetOrdersUseCase(repo);

      // Act
      const result = await useCase.execute({});

      // Assert
      expect(result.items).toEqual(orders);
      expect(result.total).toEqual(orders.length);
      expect(result.nextToken).toBeNull();
    });
    it('should return an empty list when there are no orders', async () => {
      // Arrange
      const repo = new InMemoryOrderRepository([]);
      const useCase = new GetOrdersUseCase(repo);

      // Act
      const result = await useCase.execute({});

      // Assert
      expect(result.items).toEqual([]);
      expect(result.total).toEqual(0);
      expect(result.nextToken).toBeNull();
    });
    it('should return the list of orders from the repository with status filter', async () => {
        // Arrange
        const orders: Order[] = [
            { id: '1', orderNumber: 1, status: 'pending', createdAt: new Date().toISOString() },
            { id: '2', orderNumber: 2, status: 'delivered', createdAt: new Date().toISOString() },
        ];
        const repo = new InMemoryOrderRepository(orders);
        const useCase = new GetOrdersUseCase(repo);

        // Act
        const result = await useCase.execute({ status: 'pending' });

        // Assert
        expect(result.items).toEqual([orders[0]]);
        expect(result.total).toEqual(1);
    });
    it('should return the list of orders from the repository with limit filter', async () => {
      // Arrange
      const orders: Order[] = [
        { id: '1', orderNumber: 1, status: 'pending', createdAt: new Date().toISOString() },
        { id: '2', orderNumber: 2, status: 'delivered', createdAt: new Date().toISOString() },
      ];
      const repo = new InMemoryOrderRepository(orders);
      const useCase = new GetOrdersUseCase(repo);

      // Act
      const result = await useCase.execute({ limit: 1 });

      // Assert
      expect(result.items.length).toEqual(1);
      expect(result.total).toEqual(2);
    });
  });
});