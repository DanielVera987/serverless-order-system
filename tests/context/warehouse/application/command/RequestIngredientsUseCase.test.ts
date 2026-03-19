import 'reflect-metadata';
import { RequestIngredientsUseCase } from '../../../../../src/context/warehouse/application/command/RequestIngredientsUseCase';
import { InMemoryIngredientRepository } from '../../infrastructure/repository/InMemoryIngredientRepository';
import InMemoryNotificationPublisher from '../../../shared/infrastructure/InMemoryNotificationPublisher';
import Env from '../../../../../src/services/warehouse/config/Environment';
import { InventoryShortageRequest, OrderRecipeAssignment } from '../../../../../src/context/warehouse/domain/ports/InventoryCheckRequest';

const makeAssignment = (orderId: string, ingredients: { name: string; quantity: number }[]): OrderRecipeAssignment => ({
  orderId,
  recipe: { id: 'recipe-1', name: 'Test Recipe', ingredients },
});

describe('RequestIngredientsUseCase', () => {
  describe('execute', () => {
    it('should publish the complete deficit when there is no stock', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository([]);
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new RequestIngredientsUseCase(ingredientRepo as any, publisher);
      const request: InventoryShortageRequest = {
        assignments: [makeAssignment('order-1', [{ name: 'tomate', quantity: 5 }])],
      };

      // Act
      await useCase.execute(request);

      // Assert
      const payload = publisher.publishedTo(Env.SNS_INGREDIENTS_NEEDED_ARN)[0].message as any;
      expect(payload.ingredients).toContainEqual({ name: 'tomate', quantity: 5 });
    });
    it('should publish the missing deficit when there is partial stock', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository([
        { id: '1', name: 'tomate', quantity: 3, createdAt: '' },
      ]);
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new RequestIngredientsUseCase(ingredientRepo as any, publisher);
      const request: InventoryShortageRequest = {
        assignments: [makeAssignment('order-1', [{ name: 'tomate', quantity: 8 }])],
      };

      // Act
      await useCase.execute(request);

      // Assert
      const payload = publisher.publishedTo(Env.SNS_INGREDIENTS_NEEDED_ARN)[0].message as any;
      expect(payload.ingredients).toContainEqual({ name: 'tomate', quantity: 5 });
    });
    it('should accumulate the deficit of multiple orders that request the same ingredient', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository([]);
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new RequestIngredientsUseCase(ingredientRepo as any, publisher);
      const request: InventoryShortageRequest = {
        assignments: [
          makeAssignment('order-1', [{ name: 'tomate', quantity: 3 }]),
          makeAssignment('order-2', [{ name: 'tomate', quantity: 4 }]),
        ],
      };

      // Act
      await useCase.execute(request);

      // Assert
      const payload = publisher.publishedTo(Env.SNS_INGREDIENTS_NEEDED_ARN)[0].message as any;
      expect(payload.ingredients).toContainEqual({ name: 'tomate', quantity: 7 });
    });
    it('should not include ingredients when the stock is sufficient for all', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository([
        { id: '1', name: 'tomate', quantity: 20, createdAt: '' },
      ]);
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new RequestIngredientsUseCase(ingredientRepo as any, publisher);
      const request: InventoryShortageRequest = {
        assignments: [makeAssignment('order-1', [{ name: 'tomate', quantity: 5 }])],
      };

      // Act
      await useCase.execute(request);

      // Assert
      const payload = publisher.publishedTo(Env.SNS_INGREDIENTS_NEEDED_ARN)[0].message as any;
      expect(payload.ingredients).toHaveLength(0);
    });
    it('should propagate the error if the repository fails', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository().simulateFailure();
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new RequestIngredientsUseCase(ingredientRepo as any, publisher);
      const request: InventoryShortageRequest = {
        assignments: [makeAssignment('order-1', [{ name: 'tomate', quantity: 5 }])],
      };

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow('DB connection error');
    });
  });
});
