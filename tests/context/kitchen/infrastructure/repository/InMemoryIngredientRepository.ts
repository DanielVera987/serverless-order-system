import IngredientRepositoryDomain from '../../../../../src/context/kitchen/domain/repository/IngredientRepository';
import Ingredient from '../../../../../src/context/kitchen/domain/entity/Ingredient';

export class InMemoryIngredientRepository implements IngredientRepositoryDomain {
  private ingredients: Ingredient[];
  private forcedError: Error | null = null;

  constructor(initialIngredients: Ingredient[] = []) {
    this.ingredients = [...initialIngredients];
  }

  simulateFailure(error = new Error('DB connection error')): this {
    this.forcedError = error;
    return this;
  }

  private checkForError(): void {
    if (this.forcedError) throw this.forcedError;
  }

  async getAll(): Promise<Ingredient[]> {
    this.checkForError();
    return [...this.ingredients];
  }

  async get(id: string): Promise<Ingredient | null> {
    this.checkForError();
    return this.ingredients.find(i => i.id === id) ?? null;
  }

  async create(ingredient: Ingredient): Promise<Ingredient> {
    this.checkForError();
    this.ingredients.push(ingredient);
    return ingredient;
  }

  async createBulk(ingredients: Ingredient[]): Promise<Ingredient[]> {
    this.checkForError();
    this.ingredients.push(...ingredients);
    return ingredients;
  }

  async update(ingredient: Ingredient): Promise<Ingredient> {
    this.checkForError();
    const index = this.ingredients.findIndex(i => i.id === ingredient.id);
    if (index !== -1) this.ingredients[index] = ingredient;
    return ingredient;
  }

  async delete(id: string): Promise<void> {
    this.checkForError();
    this.ingredients = this.ingredients.filter(i => i.id !== id);
  }
}
