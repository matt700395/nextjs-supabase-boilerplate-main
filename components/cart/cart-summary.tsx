/**
 * @file cart-summary.tsx
 * @description 장바구니 요약 컴포넌트
 *
 * 장바구니의 총 금액을 표시하고 주문하기 버튼을 제공합니다.
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { CartItemWithProduct } from "@/types/cart";

interface CartSummaryProps {
  items: CartItemWithProduct[];
}

/**
 * 장바구니 요약 컴포넌트
 */
export function CartSummary({ items }: CartSummaryProps) {
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h2 className="text-xl font-bold mb-4">주문 요약</h2>

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

      <Link href="/checkout" className="block">
        <Button size="lg" className="w-full" disabled={items.length === 0}>
          주문하기
        </Button>
      </Link>
    </div>
  );
}

