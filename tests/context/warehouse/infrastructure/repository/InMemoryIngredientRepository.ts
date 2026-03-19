import IngredientRepository from '../../../../../src/context/warehouse/domain/repository/IngredientRepository';
import Ingredient from '../../../../../src/context/warehouse/domain/entity/Ingredient';

export class InMemoryIngredientRepository implements IngredientRepository {
  private ingredients: Ingredient[];
  private forcedError: Error | null = null;
  private atomicAlwaysFail = false;

  constructor(initialIngredients: Ingredient[] = []) {
    this.ingredients = [...initialIngredients];
  }

  simulateFailure(error = new Error('DB connection error')): this {
    this.forcedError = error;
    return this;
  }

  simulateAtomicFailure(): this {
    this.atomicAlwaysFail = true;
    return this;
  }

  getIngredients(): Ingredient[] {
    return [...this.ingredients];
  }

  private checkForError(): void {
    if (this.forcedError) throw this.forcedError;
  }

  async getAll(): Promise<Ingredient[]> {
    this.checkForError();
    return [...this.ingredients];
  }

  async update(ingredient: Ingredient): Promise<Ingredient> {
    this.checkForError();
    const index = this.ingredients.findIndex(i => i.id === ingredient.id);
    if (index !== -1) this.ingredients[index] = ingredient;
    else this.ingredients.push(ingredient);
    return ingredient;
  }

  async updateStockAtomic(id: string, quantityToDeduct: number): Promise<boolean> {
    this.checkForError();
    if (this.atomicAlwaysFail) return false;
    const ingredient = this.ingredients.find(i => i.id === id);
    if (!ingredient || ingredient.quantity < quantityToDeduct) return false;
    ingredient.quantity -= quantityToDeduct;
    return true;
  }
}
