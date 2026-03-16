export default interface Order {
  id: string;
  orderNumber: number;
  status: string;
  recipeId?: string;
  recipeName?: string;
  createdAt: string;
  updatedAt?: string;
}
