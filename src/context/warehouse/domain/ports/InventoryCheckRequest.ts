export interface RecipeIngredient {
  name: string;
  quantity: number;
}

export interface OrderRecipeAssignment {
  orderId: string;
  recipe: {
    id: string;
    name: string;
    ingredients: RecipeIngredient[];
  };
}

export interface InventoryCheckRequest {
  assignments: OrderRecipeAssignment[];
}
