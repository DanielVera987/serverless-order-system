import 'reflect-metadata';
import { CreateOrderUseCase } from '../../../../../src/context/orders/application/create/CreateOrderUseCase';
import { CreateError } from '../../../../../src/context/shared/domain/errors/DomainError';
import InMemoryOrderRepository from '../../infrastructure/repository/InMemoryOrderRepository';
import InMemoryNotificationPublisher from '../../../shared/infrastructure/InMemoryNotificationPublisher';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

describe('CreateOrderUseCase', () => {
  describe('execute', () => {
    it('should create orders', async () => {
      // Arrange
      const numberOrders = 3;
      const repo = new InMemoryOrderRepository();
      const useCase = new CreateOrderUseCase(repo, new InMemoryNotificationPublisher());

      // Act
      const result = await useCase.execute({ numberOrders });

      // Assert
      expect(result).toHaveLength(numberOrders);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.stringMatching(UUID_REGEX),
            orderNumber: expect.any(Number),
            status: 'pending',
            createdAt: expect.stringMatching(ISO_DATE_REGEX),
          }),
        ])
      );
    });

    it('should create orders with sequential order number in descending order', async () => {
      // Arrange
      const repo = new InMemoryOrderRepository();
      const useCase = new CreateOrderUseCase(repo, new InMemoryNotificationPublisher());

      // Act
      const result = await useCase.execute({ numberOrders: 3 });

      // Assert
      expect(result.map(o => o.orderNumber)).toEqual([3, 2, 1]);
    });

    it('should create orders with sequential order number in ascending order', async () => {
      // Arrange — repositorio con 3 órdenes previas
      const existingOrders = [
        { id: '1', orderNumber: 1, status: 'pending', createdAt: '' },
        { id: '2', orderNumber: 2, status: 'pending', createdAt: '' },
        { id: '3', orderNumber: 3, status: 'pending', createdAt: '' },
      ];
      const repo = new InMemoryOrderRepository(existingOrders);
      const useCase = new CreateOrderUseCase(repo, new InMemoryNotificationPublisher());

      // Act
      const result = await useCase.execute({ numberOrders: 2 });

      // Assert — continúan desde 4 (desc: [5, 4])
      expect(result.map(o => o.orderNumber)).toEqual([5, 4]);
    });

    it('should persist orders in the repository', async () => {
      // Arrange
      const repo = new InMemoryOrderRepository();
      const useCase = new CreateOrderUseCase(repo, new InMemoryNotificationPublisher());

      // Act
      await useCase.execute({ numberOrders: 2 });

      // Assert
      const stored = await repo.getAll();
      expect(stored.items).toHaveLength(2);
    });

    it('should propagate error if the repository fails', async () => {
      // Arrange
      const repo = new InMemoryOrderRepository().simulateFailure();
      const useCase = new CreateOrderUseCase(repo, new InMemoryNotificationPublisher());

      // Act & Assert
      await expect(useCase.execute({ numberOrders: 1 })).rejects.toThrow(CreateError);
    });
  });
});
