import { ApiGatewayHandler } from "../../../../../../context/shared/infrastructure/controller/ControllerBase";
import { Inject, Injectable } from "../../../../../../context/shared/infrastructure/di";
import types from "../../types";
import { UseCase } from "../../../../../../context/shared/domain/UseCase";
import GetPurchaseHistoryRequest from "../../../../../../context/warehouse/domain/ports/GetPurchaseHistoryRequest";
import { PaginatedResult } from "../../../../../../context/shared/domain/database/PaginatedResult";
import PurchaseHistory from "../../../../../../context/warehouse/domain/entity/PurchaseHistory";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Logger from '../../../../../../context/shared/domain/logger/Logger';

@Injectable()
export class ApiGatewayController implements ApiGatewayHandler {
    constructor(
        @Inject(types.GetPurchasesUseCase) private readonly getPurchasesUseCase: UseCase<GetPurchaseHistoryRequest, PaginatedResult<PurchaseHistory>>
    ) {}

    async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        try {
            Logger.init(`ApiGatewayController: queryStringParameters: ${event.queryStringParameters}`);

            let { limit, nextToken } = event.queryStringParameters ?? {};

            if (!limit) {
                limit = '100';
            }

            const request: GetPurchaseHistoryRequest = {
                limit: Number(limit),
                nextToken,
                entityType: 'ORDER',
                purchaseDate: '',
            };

            const result = await this.getPurchasesUseCase.execute(request);

            Logger.log(`ApiGatewayController: result: ${result}`);

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Purchases retrieved successfully',
                    data: result.items,
                    pagination: {
                        total: result.total,
                        nextToken: result.nextToken,
                        limit: request.limit ?? 100,
                    },
                }),
            };
        } catch (error) {
            Logger.error(`ApiGatewayController: Error getting purchases: ${error}`);
            throw new Error(`❌ ${this.constructor.name}: Error getting purchases`);
        }
    }
}