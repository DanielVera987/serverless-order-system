import Ingredient from "./Ingredient";

export default interface Order {
  id: string;
  orderNumber: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  recipeId?: string;
  recipeName?: string;
  ingredients?: Ingredient[];
}