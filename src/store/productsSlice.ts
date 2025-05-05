import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../types/product";

interface ProductsState {
  items: Product[];
  selectedIds: string[];
  filters: {
    categories: string[];
    inStockOnly: boolean;
  };
}

const initialState: ProductsState = {
  items: [
    {
      id: "1",
      name: "Laptop",
      category: "Electronics",
      price: 999.99,
      stock: 10,
    },
    { id: "2", name: "T-Shirt", category: "Apparel", price: 19.99, stock: 25 },
    {
      id: "3",
      name: "Smartphone",
      category: "Electronics",
      price: 699.99,
      stock: 5,
    },
    { id: "4", name: "Coffee", category: "Food", price: 9.99, stock: 50 },
    {
      id: "5",
      name: "Headphones",
      category: "Electronics",
      price: 149.99,
      stock: 0,
    },
  ],
  selectedIds: [],
  filters: {
    categories: [],
    inStockOnly: false,
  },
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index >= 0) state.items[index] = action.payload;
    },
    deleteProducts: (state, action: PayloadAction<string[]>) => {
      state.items = state.items.filter((p) => !action.payload.includes(p.id));
      state.selectedIds = state.selectedIds.filter(
        (id) => !action.payload.includes(id)
      );
    },
    toggleProductSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedIds.indexOf(action.payload);
      if (index >= 0) {
        state.selectedIds.splice(index, 1);
      } else {
        state.selectedIds.push(action.payload);
      }
    },
    setCategoryFilter: (state, action: PayloadAction<string[]>) => {
      state.filters.categories = action.payload;
    },
    toggleInStockFilter: (state) => {
      state.filters.inStockOnly = !state.filters.inStockOnly;
    },
  },
});

export const {
  addProduct,
  updateProduct,
  deleteProducts,
  toggleProductSelection,
  setCategoryFilter,
  toggleInStockFilter,
} = productsSlice.actions;

export default productsSlice.reducer;
