import 'reflect-metadata';
import GetPurchasesUseCase from '../../../../../src/context/warehouse/application/query/GetPurchasesUseCase';
import { InMemoryPurchaseHistoryRepository } from '../../infrastructure/repository/InMemoryPurchaseHistoryRepository';
import PurchaseHistory from '../../../../../src/context/warehouse/domain/entity/PurchaseHistory';
import GetPurchaseHistoryRequest from '../../../../../src/context/warehouse/domain/ports/GetPurchaseHistoryRequest';

const baseParams: GetPurchaseHistoryRequest = { entityType: 'ORDER', purchaseDate: '' };
  
const makePurchase = (id: string): PurchaseHistory => ({
  id,
  entityType: 'ORDER',
  purchaseDate: new Date().toISOString(),
  ingredients: [{ name: 'tomate', quantity: 5 }],
  createdAt: new Date().toISOString(),
});

describe('GetPurchasesUseCase', () => {
  describe('execute', () => {
    it('should return the purchase history with the correct total', async () => {
      // Arrange
      const purchases = [makePurchase('p-1'), makePurchase('p-2'), makePurchase('p-3')];
      const repo = new InMemoryPurchaseHistoryRepository(purchases);
      const useCase = new GetPurchasesUseCase(repo);

      // Act
      const result = await useCase.execute(baseParams);

      // Assert
      expect(result.items).toHaveLength(3);
      expect(result.total).toBe(3);
    });
    it('should return an empty list when there is no history', async () => {
      // Arrange
      const repo = new InMemoryPurchaseHistoryRepository([]);
      const useCase = new GetPurchasesUseCase(repo);

      // Act
      const result = await useCase.execute(baseParams);

      // Assert
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });
    it('should reflect the real total independently of the pagination', async () => {
      // Arrange
      const purchases = Array.from({ length: 5 }, (_, i) => makePurchase(`p-${i}`));
      const repo = new InMemoryPurchaseHistoryRepository(purchases);
      const useCase = new GetPurchasesUseCase(repo);

      // Act
      const result = await useCase.execute({ ...baseParams, limit: 2 });

      // Assert
      expect(result.total).toBe(5);
    });
    it('should propagate the error if the repository fails', async () => {
      // Arrange
      const repo = new InMemoryPurchaseHistoryRepository().simulateFailure();
      const useCase = new GetPurchasesUseCase(repo);

      // Act & Assert
      await expect(useCase.execute(baseParams)).rejects.toThrow('DB connection error');
    });
  });
});
