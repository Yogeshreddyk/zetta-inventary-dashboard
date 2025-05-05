import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setCategoryFilter, toggleInStockFilter } from "../store/productsSlice";
import { CATEGORIES } from "../types/product";

export default function FilterSection() {
  const dispatch = useAppDispatch();
  const { categories, inStockOnly } = useAppSelector(
    (state) => state.products.filters
  );

  return (
    <div className="flex flex-wrap gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Categories</label>
        <select
          multiple
          value={categories}
          onChange={(e) => {
            const options = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            dispatch(setCategoryFilter(options));
          }}
          className="border rounded p-2 min-w-[200px]"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="inStockOnly"
          checked={inStockOnly}
          onChange={() => dispatch(toggleInStockFilter())}
          className="mr-2"
        />
        <label htmlFor="inStockOnly">In Stock Only</label>
      </div>
    </div>
  );
}
