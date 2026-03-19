import PurchaseHistoryRepository from '../../../../../src/context/warehouse/domain/repository/PurchaseHistoryRepository';
import PurchaseHistory from '../../../../../src/context/warehouse/domain/entity/PurchaseHistory';
import { PaginatedResult } from '../../../../../src/context/shared/domain/database/PaginatedResult';
import GetPurchaseHistoryRequest from '../../../../../src/context/warehouse/domain/ports/GetPurchaseHistoryRequest';

export class InMemoryPurchaseHistoryRepository implements PurchaseHistoryRepository {
  private history: PurchaseHistory[];
  private forcedError: Error | null = null;

  constructor(initialHistory: PurchaseHistory[] = []) {
    this.history = [...initialHistory];
  }

  simulateFailure(error = new Error('DB connection error')): this {
    this.forcedError = error;
    return this;
  }

  private checkForError(): void {
    if (this.forcedError) throw this.forcedError;
  }

  getHistory(): PurchaseHistory[] {
    return [...this.history];
  }

  async create(purchaseHistories: PurchaseHistory[]): Promise<PurchaseHistory[]> {
    this.checkForError();
    this.history.push(...purchaseHistories);
    return purchaseHistories;
  }

  async getAll(_params?: GetPurchaseHistoryRequest): Promise<PaginatedResult<PurchaseHistory>> {
    this.checkForError();
    return {
      items: [...this.history],
      total: this.history.length,
      nextToken: null,
    };
  }

  async count(_params?: GetPurchaseHistoryRequest): Promise<number> {
    this.checkForError();
    return this.history.length;
  }
}
