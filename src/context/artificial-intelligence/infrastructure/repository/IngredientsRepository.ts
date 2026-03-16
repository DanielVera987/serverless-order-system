import Environment from "../../../../services/artificial-intelligence/config/Environment";
import Http from "../../../shared/domain/http/Http";
import { Inject, Injectable } from "../../../shared/infrastructure/di";
import TypesShared from "../../../shared/SharedTypes";
import IngredientsRepositoryDomain from "../../domain/repository/IngredientsRepository";

@Injectable()
export default class IngredientsRepository implements IngredientsRepositoryDomain {
  constructor(
    @Inject(TypesShared.Http) private readonly http: Http
  ) {}

  async getAll(): Promise<string[]> {
    try {
      const response = await this.http.get(`${Environment.RESTAURANT_AI_API_URL}/ingredients`);

      if (response.status !== 200) {
          console.error(`❌ ${this.constructor.name}: Error getting all ingredients`, response.data);
          throw new Error(`❌ ${this.constructor.name}: Error getting all ingredients`);
      }

      const ingredients = response.data.data.map((ingredient: any) => ingredient.name);

      console.log('🚀 IngredientsRepository ingredients', ingredients);

      return ingredients as string[];
    } catch (error) {
      console.error(`❌ ${this.constructor.name}: Error getting all ingredients`, error);
      throw new Error(`❌ ${this.constructor.name}: Error getting all ingredients`);
    }
  }
}