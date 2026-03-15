import { SQSRecord } from 'aws-lambda';
import { SqsHandler, SQSBody } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';
import { Injectable, Inject } from '../../../../../../context/shared/infrastructure/di';
import { UseCase } from '../../../../../../context/shared/domain/UseCase';
import { InventoryCheckRequest } from '../../../../../../context/warehouse/domain/ports/InventoryCheckRequest';
import types from '../../types';

@Injectable()
export class SQSController implements SqsHandler {
    constructor(
        @Inject(types.CheckInventoryUseCase) private readonly checkInventoryUseCase: UseCase<InventoryCheckRequest, void>,
    ) {}

    async handleRecord(record: SQSRecord, body: SQSBody): Promise<void> {
        const parsed = JSON.parse(body.Message);
        const request = parsed.assignments ? parsed : { assignments: parsed };

        await this.checkInventoryUseCase.execute(request);
    }
}
