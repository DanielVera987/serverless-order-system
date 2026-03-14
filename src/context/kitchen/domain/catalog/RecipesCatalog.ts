import Recipe from '../entity/Recipe';
import Ingredient from '../entity/Ingredient';

const RECIPES_CATALOG: Recipe[] = [
  {
    id: 'recipe-1',
    name: 'Hamburguesa Clasica',
    ingredients: [
      { name: 'meat', quantity: 2 },
      { name: 'lettuce', quantity: 1 },
      { name: 'cheese', quantity: 1 },
      { name: 'onion', quantity: 1 },
      { name: 'ketchup', quantity: 1 },
    ],
  },
  {
    id: 'recipe-2',
    name: 'Ensalada Caesar',
    ingredients: [
      { name: 'lettuce', quantity: 3 },
      { name: 'chicken', quantity: 2 },
      { name: 'cheese', quantity: 1 },
      { name: 'lemon', quantity: 1 },
    ],
  },
  {
    id: 'recipe-3',
    name: 'Arroz con Pollo',
    ingredients: [
      { name: 'rice', quantity: 3 },
      { name: 'chicken', quantity: 2 },
      { name: 'onion', quantity: 1 },
      { name: 'tomato', quantity: 1 },
    ],
  },
  {
    id: 'recipe-4',
    name: 'Papas Gratinadas',
    ingredients: [
      { name: 'potato', quantity: 3 },
      { name: 'cheese', quantity: 2 },
      { name: 'onion', quantity: 1 },
      { name: 'ketchup', quantity: 1 },
    ],
  },
  {
    id: 'recipe-5',
    name: 'Ceviche de Pollo',
    ingredients: [
      { name: 'chicken', quantity: 2 },
      { name: 'lemon', quantity: 2 },
      { name: 'onion', quantity: 1 },
      { name: 'tomato', quantity: 1 },
    ],
  },
  {
    id: 'recipe-6',
    name: 'Wrap de Carne',
    ingredients: [
      { name: 'meat', quantity: 2 },
      { name: 'lettuce', quantity: 1 },
      { name: 'tomato', quantity: 1 },
      { name: 'cheese', quantity: 1 },
      { name: 'rice', quantity: 1 },
    ],
  },
];

export function getRandomRecipe(): Recipe {
  const index = Math.floor(Math.random() * RECIPES_CATALOG.length);
  return RECIPES_CATALOG[index];
}

export function getAllRecipes(): Recipe[] {
  return RECIPES_CATALOG;
}

export default RECIPES_CATALOG;
