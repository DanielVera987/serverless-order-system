import { OrderRecipeAssignment } from './InventoryCheckRequest';

export interface BuyMarketRequest {
  ingredients: Ingredient[];
  assignments: OrderRecipeAssignment[];
}

export interface Ingredient {
  name: string;
  quantity: number;
}