import { SQSRecord } from 'aws-lambda';
import { SqsHandler, SQSBody } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';
import { Injectable, Inject } from '../../../../../../context/shared/infrastructure/di';
import { UseCase } from '../../../../../../context/shared/domain/UseCase';
import { CompleteOrderRequest } from '../../../../../../context/warehouse/domain/ports/CompleteOrderRequest';
import types from '../../../../../../context/warehouse/Types';

@Injectable()
export class SQSController implements SqsHandler {
    constructor(
        @Inject(types.CompleteOrderUseCase) private readonly completeOrderUseCase: UseCase<CompleteOrderRequest, void>,
    ) {}

    async handleRecord(record: SQSRecord, body: SQSBody): Promise<void> {
        const message: CompleteOrderRequest = JSON.parse(body.Message);

        await this.completeOrderUseCase.execute(message);
    }
}
