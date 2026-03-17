import { SQSRecord } from 'aws-lambda';
import { SqsHandler, SQSBody } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';
import { Injectable, Inject } from '../../../../../../context/shared/infrastructure/di';
import { UseCase } from '../../../../../../context/shared/domain/UseCase';
import { InventoryReadyRequest } from '../../../../../../context/warehouse/domain/ports/InventoryCheckRequest';
import types from '../../types';

@Injectable()
export class SQSController implements SqsHandler {
  constructor(
    @Inject(types.DeductStockUseCase)
    private readonly deductStockUseCase: UseCase<InventoryReadyRequest, void>,
  ) {}

  async handleRecord(record: SQSRecord, body: any): Promise<void> {
    console.log('🔍 DeductStock SQSController handleRecord', body);

    const request = this.normalizeRequest(body);
    await this.deductStockUseCase.execute(request);
  }

  private normalizeRequest(body: SQSBody | InventoryReadyRequest | unknown): InventoryReadyRequest {
    const payload = this.parseSnsMessageIfNeeded(body);

    if (this.isInventoryReadyRequest(payload)) {
      return payload;
    }

    throw new Error('❌ Invalid payload for deductStock: assignments array is required');
  }

  private parseSnsMessageIfNeeded(body: SQSBody | InventoryReadyRequest | unknown): unknown {
    if (typeof body === 'object' && body !== null && 'Message' in body) {
      const message = (body as SQSBody).Message;
      return typeof message === 'string' ? JSON.parse(message) : message;
    }
    return body;
  }

  private isInventoryReadyRequest(payload: unknown): payload is InventoryReadyRequest {
    return typeof payload === 'object'
      && payload !== null
      && 'assignments' in payload
      && Array.isArray((payload as InventoryReadyRequest).assignments);
  }
}
