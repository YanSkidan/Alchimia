export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface Cocktail {
  id: string;
  name: string;
  image: string;
  imageG: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  history: string;
  category: string;
  glassType: string;
  isAlcoholic: boolean;
  tags: string[];
}