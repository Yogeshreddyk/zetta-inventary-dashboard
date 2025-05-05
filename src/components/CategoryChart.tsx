import { useMemo } from "react";
import type { Product } from "../types/product";
import { CATEGORIES } from "../types/product";

interface CategoryChartProps {
  products: Product[];
}

export default function CategoryChart({ products }: CategoryChartProps) {
  const data = useMemo(() => {
    return CATEGORIES.map((category) => ({
      name: category,
      count: products.filter((p) => p.category === category).length,
    }));
  }, [products]);

  const maxCount = Math.max(...data.map((item) => item.count), 1);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Products by Category</h2>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center">
            <div className="w-32">{item.name}</div>
            <div className="flex-1 flex items-center">
              <div
                className="bg-blue-500 h-6"
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              ></div>
              <span className="ml-2">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
