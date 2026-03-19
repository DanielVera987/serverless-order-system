import FarmersMarketRepository, {
  FarmersMarketRequest,
  FarmersMarketResponse,
} from '../../../../../src/context/warehouse/domain/repository/FarmersMarketRepository';

export class InMemoryFarmersMarketRepository implements FarmersMarketRepository {
  private responseQueue: FarmersMarketResponse[] = [];
  private defaultQuantity: number;
  private forcedError: Error | null = null;
  public callCount = 0;

  constructor(defaultQuantity = 10) {
    this.defaultQuantity = defaultQuantity;
  }

  /** Agrega respuestas específicas para los primeros N llamados */
  addResponse(quantitySold: number): this {
    this.responseQueue.push({ quantitySold });
    return this;
  }

  simulateFailure(error = new Error('Market unavailable')): this {
    this.forcedError = error;
    return this;
  }

  async buy(_request: FarmersMarketRequest): Promise<FarmersMarketResponse> {
    if (this.forcedError) throw this.forcedError;
    this.callCount++;
    return this.responseQueue.shift() ?? { quantitySold: this.defaultQuantity };
  }
}
