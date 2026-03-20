import 'reflect-metadata';
import BuyMarketUseCase from '../../../../../src/context/warehouse/application/command/BuyMarketUseCase';
import { CommandError } from '../../../../../src/context/shared/domain/errors/DomainError';
import { InMemoryIngredientRepository } from '../../infrastructure/repository/InMemoryIngredientRepository';
import { InMemoryPurchaseHistoryRepository } from '../../infrastructure/repository/InMemoryPurchaseHistoryRepository';
import { InMemoryFarmersMarketRepository } from '../../infrastructure/repository/InMemoryFarmersMarketRepository';
import InMemoryNotificationPublisher from '../../../shared/infrastructure/InMemoryNotificationPublisher';
import Env from '../../../../../src/services/warehouse/config/Environment';
import { BuyMarketRequest } from '../../../../../src/context/warehouse/domain/ports/ByMarketRequest';
import { OrderRecipeAssignment } from '../../../../../src/context/warehouse/domain/ports/InventoryCheckRequest';

const makeAssignment = (orderId: string): OrderRecipeAssignment => ({
  orderId,
  recipe: { id: 'recipe-1', name: 'Test Recipe', ingredients: [] },
});

describe('BuyMarketUseCase', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe('execute', () => {
    it('should buy the ingredients needed and update stock', async () => {
      // Arrange
      const ingredientRepository = new InMemoryIngredientRepository([
        { id: 'ing-1', name: 'tomate', quantity: 0, createdAt: '' },
      ]);
      const market = new InMemoryFarmersMarketRepository(10);
      const purchaseRepo = new InMemoryPurchaseHistoryRepository();
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new BuyMarketUseCase(market, ingredientRepository, publisher, purchaseRepo);
      const request: BuyMarketRequest = {
        ingredients: [{ name: 'tomate', quantity: 5 }],
        assignments: [makeAssignment('order-1')],
      };

      // Act
      await useCase.execute(request);

      // Assert
      const updated = ingredientRepository.getIngredients()[0];
      expect(updated.quantity).toBe(10);
    });
    it('should register the purchase history after the transaction', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository([
        { id: 'ing-1', name: 'tomate', quantity: 0, createdAt: '' },
      ]);
      const market = new InMemoryFarmersMarketRepository(10);
      const purchaseRepo = new InMemoryPurchaseHistoryRepository();
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new BuyMarketUseCase(market, ingredientRepo, publisher, purchaseRepo);
      const request: BuyMarketRequest = {
        ingredients: [{ name: 'tomate', quantity: 5 }],
        assignments: [makeAssignment('order-1')],
      };

      // Act
      await useCase.execute(request);

      // Assert
      expect(purchaseRepo.getHistory()).toHaveLength(1);
      expect(purchaseRepo.getHistory()[0].ingredients[0].name).toBe('tomate');
    });
    it('should publish to SNS with the original orders after buying', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository([
        { id: 'ing-1', name: 'tomate', quantity: 0, createdAt: '' },
      ]);
      const market = new InMemoryFarmersMarketRepository(10);
      const purchaseRepo = new InMemoryPurchaseHistoryRepository();
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new BuyMarketUseCase(market, ingredientRepo, publisher, purchaseRepo);
      const request: BuyMarketRequest = {
        ingredients: [{ name: 'tomate', quantity: 5 }],
        assignments: [makeAssignment('order-1')],
      };

      // Act
      await useCase.execute(request);

      // Assert
      const publications = publisher.publishedTo(Env.SNS_INGREDIENTS_PURCHASED_ARN);
      expect(publications).toHaveLength(1);

      const payload = publications[0].message as any;
      expect(payload.assignments[0].orderId).toBe('order-1');
    });
    it('should retry the purchase when the market returns 0 in the first attempt', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository([
        { id: 'ing-1', name: 'tomate', quantity: 0, createdAt: '' },
      ]);
      const market = new InMemoryFarmersMarketRepository(10)
        .addResponse(0)
        .addResponse(10);
      const purchaseRepo = new InMemoryPurchaseHistoryRepository();
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new BuyMarketUseCase(market, ingredientRepo, publisher, purchaseRepo);
      const request: BuyMarketRequest = {
        ingredients: [{ name: 'tomate', quantity: 5 }],
        assignments: [makeAssignment('order-1')],
      };

      // Act
      await useCase.execute(request);

      // Assert
      expect(market.callCount).toBe(2);
    });
    it('should propagate the error if the ingredient repository fails', async () => {
      // Arrange
      const ingredientRepo = new InMemoryIngredientRepository().simulateFailure();
      const market = new InMemoryFarmersMarketRepository();
      const purchaseRepo = new InMemoryPurchaseHistoryRepository();
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new BuyMarketUseCase(market, ingredientRepo, publisher, purchaseRepo);
      const request: BuyMarketRequest = {
        ingredients: [{ name: 'tomate', quantity: 5 }],
        assignments: [makeAssignment('order-1')],
      };

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow(CommandError);
    });
  });
});
