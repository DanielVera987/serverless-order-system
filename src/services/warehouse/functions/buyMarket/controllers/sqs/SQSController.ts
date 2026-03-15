import Types from "../../Types";
import { SQSRecord } from "aws-lambda";
import { UseCase } from "../../../../../../context/shared/domain/UseCase";
import { Injectable, Inject } from "../../../../../../context/shared/infrastructure/di";
import { SQSBody } from "../../../../../../context/shared/infrastructure/controller/ControllerBase";
import { BuyMarketRequest } from "../../../../../../context/warehouse/domain/ports/ByMarketRequest";
import { SqsHandler } from "../../../../../../context/shared/infrastructure/controller/ControllerBase";

@Injectable()
export class SQSController implements SqsHandler {
    constructor(
        @Inject(Types.BuyMarketUseCase) private readonly buyMarketUseCase: UseCase<BuyMarketRequest, void>,
    ) {}

    async handleRecord(record: SQSRecord, body: SQSBody): Promise<void> {
        const message: BuyMarketRequest = JSON.parse(body.Message);

        await this.buyMarketUseCase.execute(message);
    }
}