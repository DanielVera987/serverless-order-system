import 'reflect-metadata';
import { CheckInventoryUseCase } from '../../../../../src/context/warehouse/application/command/CheckInventoryUseCase';
import { InMemoryIngredientRepository } from '../../infrastructure/repository/InMemoryIngredientRepository';
import InMemoryNotificationPublisher from '../../../shared/infrastructure/InMemoryNotificationPublisher';
import Env from '../../../../../src/services/warehouse/config/Environment';
import { InventoryCheckRequest, OrderRecipeAssignment } from '../../../../../src/context/warehouse/domain/ports/InventoryCheckRequest';

const makeAssignment = (orderId: string, ingredientName: string, qty: number): OrderRecipeAssignment => ({
  orderId,
  recipe: {
    id: 'recipe-1',
    name: 'Test Recipe',
    ingredients: [{ name: ingredientName, quantity: qty }],
  },
});

describe('CheckInventoryUseCase', () => {
  describe('execute', () => {
    it('should publish to inventory-ready when all orders have enough stock', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository([
        { id: '1', name: 'tomate', quantity: 10, createdAt: '' },
      ]);
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new CheckInventoryUseCase(ingredientRepo as any, publisher);
      const request: InventoryCheckRequest = {
        assignments: [makeAssignment('order-1', 'tomate', 5)],
      };

      // Act
      await useCase.execute(request);

      // Assert
      expect(publisher.publishedTo(Env.SNS_INVENTORY_READY_ARN)).toHaveLength(1);
      expect(publisher.publishedTo(Env.SNS_INVENTORY_SHORTAGE_ARN)).toHaveLength(0);
    });
    it('should publish to inventory-shortage when there is not enough stock', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository([
        { id: '1', name: 'tomate', quantity: 2, createdAt: '' },
      ]);
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new CheckInventoryUseCase(ingredientRepo as any, publisher);
      const request: InventoryCheckRequest = {
        assignments: [makeAssignment('order-1', 'tomate', 5)],
      };

      // Act
      await useCase.execute(request);

      // Assert
      expect(publisher.publishedTo(Env.SNS_INVENTORY_READY_ARN)).toHaveLength(0);
      expect(publisher.publishedTo(Env.SNS_INVENTORY_SHORTAGE_ARN)).toHaveLength(1);
    });
    it('should classify orders with and without stock (mixed)', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository([
        { id: '1', name: 'tomate', quantity: 10, createdAt: '' },
        { id: '2', name: 'cebolla', quantity: 1, createdAt: '' },
      ]);
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new CheckInventoryUseCase(ingredientRepo as any, publisher);
      const request: InventoryCheckRequest = {
        assignments: [
          makeAssignment('order-ready', 'tomate', 5),
          makeAssignment('order-shortage', 'cebolla', 5),
        ],
      };

      // Act
      await useCase.execute(request);

      // Assert
      const readyPayload = publisher.publishedTo(Env.SNS_INVENTORY_READY_ARN)[0].message as any;
      const shortagePayload = publisher.publishedTo(Env.SNS_INVENTORY_SHORTAGE_ARN)[0].message as any;

      expect(readyPayload.assignments[0].orderId).toBe('order-ready');
      expect(shortagePayload.assignments[0].orderId).toBe('order-shortage');
    });
    it('should not publish anything when there are no assignments', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository([]);
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new CheckInventoryUseCase(ingredientRepo as any, publisher);
      const request: InventoryCheckRequest = { assignments: [] };

      // Act
      await useCase.execute(request);

      // Assert
      expect(publisher.publications).toHaveLength(0);
    });
    it('should propagate the error if the ingredient repository fails', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository().simulateFailure();
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new CheckInventoryUseCase(ingredientRepo as any, publisher);
      const request: InventoryCheckRequest = {
        assignments: [makeAssignment('order-1', 'tomate', 5)],
      };

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow('DB connection error');
    });
  });
});
