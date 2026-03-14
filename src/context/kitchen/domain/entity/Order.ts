export default interface Order {
    id: string;
    status: string;
    recipeId?: string;
    recipeName?: string;
    createdAt: string;
    updatedAt?: string;
}
  