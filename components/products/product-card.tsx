/**
 * @file product-card.tsx
 * @description 상품 카드 컴포넌트
 *
 * 상품 정보를 카드 형태로 표시하는 재사용 가능한 컴포넌트입니다.
 * 상품 이미지, 이름, 가격, 카테고리를 표시하고 클릭 시 상품 상세 페이지로 이동합니다.
 */

import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

/**
 * 상품 카드 컴포넌트
 *
 * @param product - 표시할 상품 데이터
 */
export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block"
      aria-label={`${product.name} 상품 보기`}
    >
      <div className="relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
        {/* 상품 이미지 영역 */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {/* 초기에는 플레이스홀더 이미지만 표시 */}
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <Package className="h-16 w-16 text-muted-foreground/30" />
          </div>
          
          {/* 품절 배지 */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded bg-destructive px-4 py-2 text-sm font-semibold text-white">
                품절
              </span>
            </div>
          )}

          {/* 카테고리 배지 */}
          {product.category && (
            <div className="absolute left-2 top-2 rounded-md bg-background/80 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
              {product.category}
            </div>
          )}
        </div>

        {/* 상품 정보 영역 */}
        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-tight group-hover:text-primary">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-foreground">
              {formatPrice(product.price)}
            </p>
            
            {!isOutOfStock && product.stock_quantity > 0 && (
              <p className="text-xs text-muted-foreground">
                재고 {product.stock_quantity}개
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

