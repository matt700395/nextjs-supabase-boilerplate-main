/**
 * @file order-summary.tsx
 * @description 주문 요약 컴포넌트
 *
 * 주문할 상품 목록과 총 금액을 표시합니다.
 */

import type { CartItemWithProduct } from "@/types/cart";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Package } from "lucide-react";

interface OrderSummaryProps {
  items: CartItemWithProduct[];
}

/**
 * 주문 요약 컴포넌트
 */
export function OrderSummary({ items }: OrderSummaryProps) {
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="border rounded-lg p-6 bg-card sticky top-24">
      <h2 className="text-xl font-bold mb-4">주문 요약</h2>

      {/* 상품 목록 */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
              <div className="flex h-full items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.product.id}`}
                className="font-medium hover:text-primary transition-colors block truncate"
              >
                {item.product.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {formatPrice(item.product.price)} × {item.quantity}개
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 구분선 */}
      <div className="border-t mb-4" />

      {/* 요약 정보 */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">상품 개수</span>
          <span className="font-medium">{items.length}개</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">총 수량</span>
          <span className="font-medium">{totalQuantity}개</span>
        </div>
        <div className="border-t pt-2 mt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>총 금액</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

