import 'reflect-metadata';
import { ReserveIngredientsUseCase } from '../../../../../src/context/warehouse/application/command/ReserveIngredientsUseCase';
import { InMemoryIngredientRepository } from '../../infrastructure/repository/InMemoryIngredientRepository';
import InMemoryNotificationPublisher from '../../../shared/infrastructure/InMemoryNotificationPublisher';
import Env from '../../../../../src/services/warehouse/config/Environment';
import { InventoryReadyRequest, OrderRecipeAssignment } from '../../../../../src/context/warehouse/domain/ports/InventoryCheckRequest';

const makeAssignment = (orderId: string, ingredientName: string, ingredientId: string, qty: number): OrderRecipeAssignment => ({
  orderId,
  recipe: {
    id: 'recipe-1',
    name: 'Test Recipe',
    ingredients: [{ name: ingredientName, quantity: qty }],
  },
});

describe('ReserveIngredientsUseCase', () => {
  describe('execute', () => {
    it('should publish to order-ready when the atomic reservation is successful', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository([
        { id: 'ing-1', name: 'tomate', quantity: 10, createdAt: '' },
      ]);
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new ReserveIngredientsUseCase(ingredientRepo as any, publisher);
      const request: InventoryReadyRequest = {
        assignments: [makeAssignment('order-1', 'tomate', 'ing-1', 5)],
      };

      // Act
      await useCase.execute(request);

      // Assert
      expect(publisher.publishedTo(Env.SNS_ORDER_READY_ARN)).toHaveLength(1);
      expect(publisher.publishedTo(Env.SNS_INVENTORY_SHORTAGE_ARN)).toHaveLength(0);
    });
    it('should publish to inventory-shortage when the atomic reservation fails (race condition)', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository([
        { id: 'ing-1', name: 'tomate', quantity: 10, createdAt: '' },
      ]).simulateAtomicFailure();
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new ReserveIngredientsUseCase(ingredientRepo as any, publisher);
      const request: InventoryReadyRequest = {
        assignments: [makeAssignment('order-1', 'tomate', 'ing-1', 5)],
      };

      // Act
      await useCase.execute(request);

      // Assert
      expect(publisher.publishedTo(Env.SNS_ORDER_READY_ARN)).toHaveLength(0);
      expect(publisher.publishedTo(Env.SNS_INVENTORY_SHORTAGE_ARN)).toHaveLength(1);
    });
    it('should fail atomically when the stock is insufficient', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository([
        { id: 'ing-1', name: 'tomate', quantity: 3, createdAt: '' },
      ]);
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new ReserveIngredientsUseCase(ingredientRepo as any, publisher);
      const request: InventoryReadyRequest = {
        assignments: [makeAssignment('order-1', 'tomate', 'ing-1', 7)],
      };

      // Act
      await useCase.execute(request);

      // Assert
      expect(publisher.publishedTo(Env.SNS_ORDER_READY_ARN)).toHaveLength(0);
      expect(publisher.publishedTo(Env.SNS_INVENTORY_SHORTAGE_ARN)).toHaveLength(1);
    });
    it('should classify successfully when there are successful and failed orders (mixed)', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository([
        { id: 'ing-1', name: 'tomate', quantity: 7, createdAt: '' },
      ]);
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new ReserveIngredientsUseCase(ingredientRepo as any, publisher);
      const request: InventoryReadyRequest = {
        assignments: [
          makeAssignment('order-ok', 'tomate', 'ing-1', 5),
          makeAssignment('order-fail', 'tomate', 'ing-1', 5),
        ],
      };

      // Act
      await useCase.execute(request);

      // Assert
      const readyPayload = publisher.publishedTo(Env.SNS_ORDER_READY_ARN)[0].message as any;
      const shortagePayload = publisher.publishedTo(Env.SNS_INVENTORY_SHORTAGE_ARN)[0].message as any;

      expect(readyPayload.assignments[0].orderId).toBe('order-ok');
      expect(shortagePayload.assignments[0].orderId).toBe('order-fail');
    });
    it('should propagate the error if the repository fails', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository().simulateFailure();
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new ReserveIngredientsUseCase(ingredientRepo as any, publisher);
      const request: InventoryReadyRequest = {
        assignments: [makeAssignment('order-1', 'tomate', 'ing-1', 5)],
      };

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow('DB connection error');
    });
  });
});
