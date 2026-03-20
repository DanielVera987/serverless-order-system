import { SQSRecord } from 'aws-lambda';
import { SqsHandler, SQSBody } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';
import { Injectable, Inject } from '../../../../../../context/shared/infrastructure/di';
import { UseCase } from '../../../../../../context/shared/domain/UseCase';
import { SQSMessageRequest } from '../../../../../../context/kitchen/domain/ports/SQSRequest';
import types from '../../../../../../context/kitchen/Types';

@Injectable()
export class SQSController implements SqsHandler {
    constructor(
        @Inject(types.GenerateRecipieUseCase) private readonly generateRecipieUseCase: UseCase<SQSMessageRequest, unknown>,
    ) {}

    async handleRecord(record: SQSRecord, body: SQSBody): Promise<void> {
        const orders = JSON.parse(body.Message);

        await this.generateRecipieUseCase.execute({ Orders: orders });
    }
}