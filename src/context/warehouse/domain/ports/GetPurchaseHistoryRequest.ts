export default interface GetPurchaseHistoryRequest {
    entityType: string;
    purchaseDate: string;
    limit?: number;
    nextToken?: string | null;
}