import { Injectable, Inject } from "../../../shared/infrastructure/di";
import Recipe from "../../domain/entity/Recipe";
import { UseCase } from "../../../shared/domain/UseCase";
import types from "../../../../services/kitchen/functions/getRecipes/types";
import RecipeRepositoryDomain from "../../../kitchen/domain/repository/RecipeRepository";

@Injectable()
export default class GetRecipesUseCase implements UseCase<unknown, Recipe[]> {
    constructor(
        @Inject(types.RecipeRepository) private readonly recipeRepository: RecipeRepositoryDomain
    ) {}

    async execute(): Promise<Recipe[]> {
        try {
            return await this.recipeRepository.getAll();
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error getting recipes`, error);
            throw new Error(`❌ ${this.constructor.name}: Error getting recipes`);
        }
    }
}