import { Injectable, Inject } from '../../../shared/infrastructure/di';
import TypesShared from '../../../shared/SharedTypes';
import FarmersMarketRepositoryDomain, { FarmersMarketRequest, FarmersMarketResponse } from '../../domain/repository/FarmersMarketRepository';
import Http from '../../../shared/domain/http/Http';

@Injectable()
export default class FarmersMarketRepository implements FarmersMarketRepositoryDomain {
    private readonly baseUrl = process.env.FARMERS_MARKET_BASE_URL ?? 'https://recruitment.alegra.com/api/farmers-market/buy';

    constructor(
        @Inject(TypesShared.Http) private readonly http: Http
    ) {}

    async buy(request: FarmersMarketRequest): Promise<FarmersMarketResponse> {
        try {
            const response = await this.http.get(`${this.baseUrl}?ingredient=${request.name}`);
            return response.data ?? response;
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error buying from farmers market`, error);
            return { quantitySold: 0 };
        }
    }
}