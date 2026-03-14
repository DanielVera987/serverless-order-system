import { OrderRecipeAssignment } from './InventoryCheckRequest';

export interface CompleteOrderRequest {
  assignments: OrderRecipeAssignment[];
}
