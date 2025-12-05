/**
 * @file product-grid.tsx
 * @description 상품 그리드 레이아웃 컴포넌트
 *
 * 상품 목록을 반응형 Grid 레이아웃으로 표시하는 컴포넌트입니다.
 * 모바일: 1열, 태블릿: 2열, 데스크톱: 3-4열로 자동 조정됩니다.
 */

import type { Product } from "@/types/product";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  /**
   * 그리드 열 개수 설정 (선택사항)
   * 기본값: 반응형 (모바일 1, 태블릿 2, 데스크톱 3-4)
   */
  columns?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3;
    desktop?: 3 | 4;
  };
}

/**
 * 상품 그리드 컴포넌트
 *
 * @param products - 표시할 상품 목록
 * @param columns - 그리드 열 개수 설정 (선택사항)
 */
export function ProductGrid({
  products,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  },
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">표시할 상품이 없습니다.</p>
      </div>
    );
  }

  const gridCols = {
    mobile: columns.mobile === 2 ? "grid-cols-2" : "grid-cols-1",
    tablet: columns.tablet === 3 ? "md:grid-cols-3" : "md:grid-cols-2",
    desktop: columns.desktop === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
  };

  return (
    <div
      className={`grid ${gridCols.mobile} ${gridCols.tablet} ${gridCols.desktop} gap-6`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
