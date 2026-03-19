import 'reflect-metadata';
import { CompleteOrderUseCase } from '../../../../../src/context/warehouse/application/command/CompleteOrderUseCase';
import { InMemoryOrderRepository } from '../../infrastructure/repository/InMemoryOrderRepository';
import { CompleteOrderRequest } from '../../../../../src/context/warehouse/domain/ports/CompleteOrderRequest';
import { OrderRecipeAssignment } from '../../../../../src/context/warehouse/domain/ports/InventoryCheckRequest';
import Order from '../../../../../src/context/warehouse/domain/entity/Order';

const makeOrder = (id: string): Order => ({
  id,
  orderNumber: 1,
  status: 'pending',
  createdAt: new Date().toISOString(),
});

const makeAssignment = (orderId: string): OrderRecipeAssignment => ({
  orderId,
  recipe: { id: 'recipe-1', name: 'Test Recipe', ingredients: [] },
});

describe('CompleteOrderUseCase', () => {
  describe('execute', () => {
    it('should update the status of the orders to delivered', async () => {
      // Arrange
      const order = makeOrder('order-1');
      const orderRepo = new InMemoryOrderRepository([order]);
      const useCase = new CompleteOrderUseCase(orderRepo as any);
      const request: CompleteOrderRequest = {
        assignments: [makeAssignment('order-1')],
      };

      // Act
      await useCase.execute(request);

      // Assert
      const updated = orderRepo.getOrders()[0];
      expect(updated.status).toBe('delivered');
    });
    it('should update multiple orders in the same batch', async () => {
      // Arrange
      const orders = [makeOrder('order-1'), makeOrder('order-2')];
      const orderRepo = new InMemoryOrderRepository(orders);
      const useCase = new CompleteOrderUseCase(orderRepo as any);
      const request: CompleteOrderRequest = {
        assignments: [makeAssignment('order-1'), makeAssignment('order-2')],
      };

      // Act
      await useCase.execute(request);

      // Assert
      const updated = orderRepo.getOrders();
      expect(updated.every(o => o.status === 'delivered')).toBe(true);
    });
    it('should continue without error if an order does not exist in the repository', async () => {
      // Arrange — repo vacío, orden no existe
      const orderRepo = new InMemoryOrderRepository([]);
      const useCase = new CompleteOrderUseCase(orderRepo as any);
      const request: CompleteOrderRequest = {
        assignments: [makeAssignment('order-inexistente')],
      };

      // Act & Assert — no debe lanzar excepción
      await expect(useCase.execute(request)).resolves.toBeUndefined();
    });
    it('should complete the orders found and skip the ones not found', async () => {
      // Arrange
      const orderRepo = new InMemoryOrderRepository([makeOrder('order-exists')]);
      const useCase = new CompleteOrderUseCase(orderRepo as any);
      const request: CompleteOrderRequest = {
        assignments: [
          makeAssignment('order-exists'),
          makeAssignment('order-not-found'),
        ],
      };

      // Act
      await useCase.execute(request);

      // Assert
      const updated = orderRepo.getOrders();
      expect(updated[0].status).toBe('delivered');
    });
    it('should propagate the error if the repository fails', async () => {
      // Arrange
      const orderRepo = new InMemoryOrderRepository().simulateFailure();
      const useCase = new CompleteOrderUseCase(orderRepo as any);
      const request: CompleteOrderRequest = {
        assignments: [makeAssignment('order-1')],
      };

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow('DB connection error');
    });
  });
});
