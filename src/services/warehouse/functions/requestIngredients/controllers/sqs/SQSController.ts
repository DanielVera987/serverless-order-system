import { SQSRecord } from 'aws-lambda';
import { SqsHandler, SQSBody } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';
import { Injectable, Inject } from '../../../../../../context/shared/infrastructure/di';
import { UseCase } from '../../../../../../context/shared/domain/UseCase';
import { InventoryShortageRequest } from '../../../../../../context/warehouse/domain/ports/InventoryCheckRequest';
import types from '../../types';

@Injectable()
export class SQSController implements SqsHandler {
  constructor(
    @Inject(types.RequestIngredientsUseCase)
    private readonly requestIngredientsUseCase: UseCase<InventoryShortageRequest, void>,
  ) {}

  async handleRecord(record: SQSRecord, body: any): Promise<void> {
    console.log('🔍 RequestIngredients SQSController handleRecord', body);

    const request = this.normalizeRequest(body);
    await this.requestIngredientsUseCase.execute(request);
  }

  private normalizeRequest(body: SQSBody | InventoryShortageRequest | unknown): InventoryShortageRequest {
    const payload = this.parseSnsMessageIfNeeded(body);

    if (this.isInventoryShortageRequest(payload)) {
      return payload;
    }

    throw new Error('❌ Invalid payload for requestIngredients: assignments array is required');
  }

  private parseSnsMessageIfNeeded(body: SQSBody | InventoryShortageRequest | unknown): unknown {
    if (typeof body === 'object' && body !== null && 'Message' in body) {
      const message = (body as SQSBody).Message;
      return typeof message === 'string' ? JSON.parse(message) : message;
    }
    return body;
  }

  private isInventoryShortageRequest(payload: unknown): payload is InventoryShortageRequest {
    return typeof payload === 'object'
      && payload !== null
      && 'assignments' in payload
      && Array.isArray((payload as InventoryShortageRequest).assignments);
  }
}
