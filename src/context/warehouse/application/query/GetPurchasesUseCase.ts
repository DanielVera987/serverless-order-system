import { UseCase } from "../../../shared/domain/UseCase";
import { Inject, Injectable } from "../../../shared/infrastructure/di";
import PurchaseHistoryRepositoryDomain from "../../domain/repository/PurchaseHistoryRepository";
import PurchaseHistory from "../../domain/entity/PurchaseHistory";
import types from "../../../../services/warehouse/functions/getPurchases/types";
import { PaginatedResult } from "../../../shared/domain/database/PaginatedResult";
import GetPurchaseHistoryRequest from "../../domain/ports/GetPurchaseHistoryRequest";
import Logger from '../../../shared/domain/logger/Logger';

@Injectable()
export default class GetPurchasesUseCase implements UseCase<unknown, PaginatedResult<PurchaseHistory>> {
    constructor(
        @Inject(types.PurchaseHistoryRepository) private readonly purchaseHistoryRepository: PurchaseHistoryRepositoryDomain
    ) {}

    async execute(params: GetPurchaseHistoryRequest): Promise<PaginatedResult<PurchaseHistory>> {
        Logger.init(`GetPurchasesUseCase: params: ${params}`);

        const [result, total] = await Promise.all([
            this.purchaseHistoryRepository.getAll(params),
            this.purchaseHistoryRepository.count(params),
        ]);

        Logger.log(`GetPurchasesUseCase: fetched ${result.items.length} of ${total} purchases`);

        return { ...result, total };
    }
}