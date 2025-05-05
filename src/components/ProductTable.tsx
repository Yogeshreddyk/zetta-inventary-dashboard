import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { toggleProductSelection } from "../store/productsSlice";
import type { Product } from "../types/product";

interface ProductTableProps {
  products: Product[];
  selectedIds: string[];
  onEdit: (product: Product) => void;
  onDelete: () => void;
}

export default function ProductTable({
  products,
  selectedIds,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const dispatch = useAppDispatch();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof Product) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="mb-8">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === products.length &&
                    products.length > 0
                  }
                  onChange={() => {
                    if (selectedIds.length === products.length) {
                      products.forEach((p) =>
                        dispatch(toggleProductSelection(p.id))
                      );
                    } else {
                      products.forEach((p) => {
                        if (!selectedIds.includes(p.id)) {
                          dispatch(toggleProductSelection(p.id));
                        }
                      });
                    }
                  }}
                />
              </th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => requestSort("name")}
              >
                Name{" "}
                {sortConfig?.key === "name" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => requestSort("category")}
              >
                Category{" "}
                {sortConfig?.key === "category" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => requestSort("price")}
              >
                Price{" "}
                {sortConfig?.key === "price" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => requestSort("stock")}
              >
                Stock{" "}
                {sortConfig?.key === "stock" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr
                key={product.id}
                className={product.stock < 5 ? "bg-yellow-50" : ""}
              >
                <td className="px-4 py-2 border">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product.id)}
                    onChange={() =>
                      dispatch(toggleProductSelection(product.id))
                    }
                  />
                </td>
                <td className="px-4 py-2 border">{product.name}</td>
                <td className="px-4 py-2 border">{product.category}</td>
                <td className="px-4 py-2 border">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-2 border">
                  <span className={product.stock === 0 ? "text-red-500" : ""}>
                    {product.stock}
                  </span>
                  {product.stock < 5 && product.stock > 0 && (
                    <span className="ml-2 text-yellow-600 text-xs">
                      Low Stock
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedIds.length > 0 && (
        <div className="mt-4">
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Selected ({selectedIds.length})
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div>
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, products.length)} to{" "}
          {Math.min(currentPage * itemsPerPage, products.length)} of{" "}
          {products.length} products
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {Math.ceil(products.length / itemsPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(p + 1, Math.ceil(products.length / itemsPerPage))
              )
            }
            disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
