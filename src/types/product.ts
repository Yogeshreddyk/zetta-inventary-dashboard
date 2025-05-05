export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export const CATEGORIES = [
  "Electronics",
  "Apparel",
  "Food",
  "Furniture",
  "Books",
];
