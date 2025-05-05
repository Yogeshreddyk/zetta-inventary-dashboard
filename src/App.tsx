import { useState } from "react";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import {
  addProduct,
  updateProduct,
  deleteProducts,
} from "./store/productsSlice";
import ProductTable from "./components/ProductTable";
import FilterSection from "./components/FilterSection";
import ProductModal from "./components/ProductModal";
import ConfirmationDialog from "./components/ConfirmationDialog";
import CategoryChart from "./components/CategoryChart";

function App() {
  const dispatch = useAppDispatch();
  const { items, selectedIds, filters } = useAppSelector(
    (state) => state.products
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = items.filter((product) => {
    const categoryMatch =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category);
    const stockMatch = !filters.inStockOnly || product.stock > 0;
    return categoryMatch && stockMatch;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    dispatch(deleteProducts(selectedIds));
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Inventory Management Dashboard
      </h1>

      <div className="flex justify-between items-center mb-6">
        <FilterSection />
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </div>

      <ProductTable
        products={filteredProducts}
        selectedIds={selectedIds}
        onEdit={handleEditProduct}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      <CategoryChart products={filteredProducts} />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSubmit={(product) => {
          if (editingProduct) {
            dispatch(updateProduct({ ...editingProduct, ...product }));
          } else {
            dispatch(addProduct({ ...product, id: Date.now().toString() }));
          }
          setIsModalOpen(false);
        }}
      />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Products"
        message={`Are you sure you want to delete ${selectedIds.length} selected products?`}
      />
    </div>
  );
}

export default App;
