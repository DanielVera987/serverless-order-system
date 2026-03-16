export interface Ingredient {
    name: string;
    quantity: number;
  }

export default interface PurchaseHistory {
    id: string; 
    entityType: string;
    purchaseDate: string;
    ingredients: Ingredient[];
    createdAt: string;
    updatedAt?: string;
}