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

export interface InventoryReadyRequest {
  assignments: OrderRecipeAssignment[];
}

export interface InventoryShortageRequest {
  assignments: OrderRecipeAssignment[];
}
