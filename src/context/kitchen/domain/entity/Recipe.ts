import Ingredient from "./Ingredient";

export default interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  createdAt?: string;
  updatedAt?: string;
}