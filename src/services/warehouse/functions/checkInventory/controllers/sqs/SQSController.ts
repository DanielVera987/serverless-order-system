import { SQSRecord } from 'aws-lambda';
import { SqsHandler, SQSBody } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';
import { Injectable, Inject } from '../../../../../../context/shared/infrastructure/di';
import { UseCase } from '../../../../../../context/shared/domain/UseCase';
import { InventoryCheckRequest } from '../../../../../../context/warehouse/domain/ports/InventoryCheckRequest';
import types from '../../types';

@Injectable()
export class SQSController implements SqsHandler {
  constructor(
    @Inject(types.CheckInventoryUseCase)
    private readonly checkInventoryUseCase: UseCase<InventoryCheckRequest, void>,
  ) {}

  async handleRecord(record: SQSRecord, body: any): Promise<void> {
    console.log('🔍 SQSController handleRecord', body);

    const request = this.normalizeRequest(body);

    await this.checkInventoryUseCase.execute(request);
  }

  private normalizeRequest(body: SQSBody | InventoryCheckRequest | unknown): InventoryCheckRequest {
    const payload = this.parseSnsMessageIfNeeded(body);

    if (this.isInventoryCheckRequest(payload)) {
      return payload;
    }

    if (Array.isArray(payload)) {
      return { assignments: payload };
    }

    throw new Error('❌ Invalid payload for checkInventory: assignments array is required');
  }

  private parseSnsMessageIfNeeded(body: SQSBody | InventoryCheckRequest | unknown): unknown {
    if (typeof body === 'object' && body !== null && 'Message' in body) {
      const message = (body as SQSBody).Message;
      return typeof message === 'string' ? JSON.parse(message) : message;
    }

    return body;
  }

  private isInventoryCheckRequest(payload: unknown): payload is InventoryCheckRequest {
    return typeof payload === 'object'
      && payload !== null
      && 'assignments' in payload
      && Array.isArray((payload as InventoryCheckRequest).assignments);
  }
}
