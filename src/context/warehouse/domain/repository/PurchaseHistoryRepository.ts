import PurchaseHistory from "../entity/PurchaseHistory";
import { PaginatedResult } from "../../../shared/domain/database/PaginatedResult";
import GetPurchaseHistoryRequest from "../ports/GetPurchaseHistoryRequest";

export default interface PurchaseHistoryRepository {
    create(purchaseHistories: PurchaseHistory[]): Promise<PurchaseHistory[]>;
    getAll(params?: GetPurchaseHistoryRequest): Promise<PaginatedResult<PurchaseHistory>>;
    count(params?: GetPurchaseHistoryRequest): Promise<number>;
}