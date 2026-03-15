export default interface FarmersMarketRepository {
  buy(request: FarmersMarketRequest): Promise<FarmersMarketResponse>;
}

export interface FarmersMarketRequest {
    name: string;
}

export interface FarmersMarketResponse {
    quantitySold: number;
}