/**
 * @file cart-item.tsx
 * @description 장바구니 아이템 컴포넌트
 *
 * 장바구니에 담긴 각 상품을 표시하고, 수량 조절 및 삭제 기능을 제공합니다.
 */

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { CartItemWithProduct } from "@/types/cart";
import { updateCartItem, removeFromCart } from "@/lib/supabase/queries/cart";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItemProps {
  item: CartItemWithProduct;
}

/**
 * 장바구니 아이템 컴포넌트
 */
export function CartItem({ item }: CartItemProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(item.quantity);
  const [error, setError] = useState<string | null>(null);

  const product = item.product;
  const itemTotalPrice = product.price * quantity;

  /**
   * 수량 증가
   */
  const handleIncreaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setError(null);

    startTransition(async () => {
      try {
        await updateCartItem(item.id, newQuantity);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "수량 변경에 실패했습니다.");
        setQuantity(quantity); // 원래 수량으로 되돌리기
      }
    });
  };

  /**
   * 수량 감소
   */
  const handleDecreaseQuantity = () => {
    if (quantity <= 1) return;

    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    setError(null);

    startTransition(async () => {
      try {
        await updateCartItem(item.id, newQuantity);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "수량 변경에 실패했습니다.");
        setQuantity(quantity); // 원래 수량으로 되돌리기
      }
    });
  };

  /**
   * 장바구니에서 삭제
   */
  const handleRemove = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    startTransition(async () => {
      try {
        await removeFromCart(item.id);
        router.refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : "삭제에 실패했습니다.");
      }
    });
  };

  return (
    <div className="flex gap-4 border-b py-6">
      {/* 상품 이미지 */}
      <Link
        href={`/products/${product.id}`}
        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-muted"
      >
        <div className="flex h-full items-center justify-center">
          <Package className="h-12 w-12 text-muted-foreground/30" />
        </div>
      </Link>

      {/* 상품 정보 */}
      <div className="flex flex-1 flex-col gap-2">
        <Link
          href={`/products/${product.id}`}
          className="font-semibold hover:text-primary transition-colors"
        >
          {product.name}
        </Link>

        <p className="text-sm text-muted-foreground">
          {formatPrice(product.price)} × {quantity}개
        </p>

        {/* 수량 조절 및 삭제 */}
        <div className="flex items-center gap-4 mt-auto">
          {/* 수량 조절 */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecreaseQuantity}
              disabled={isPending || quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncreaseQuantity}
              disabled={isPending || quantity >= product.stock_quantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* 삭제 버튼 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isPending}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            삭제
          </Button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* 재고 부족 경고 */}
        {quantity >= product.stock_quantity && (
          <p className="text-sm text-destructive">
            재고가 부족합니다. (현재 재고: {product.stock_quantity}개)
          </p>
        )}
      </div>

      {/* 총 가격 */}
      <div className="text-right">
        <p className="text-lg font-bold">{formatPrice(itemTotalPrice)}</p>
      </div>
    </div>
  );
}

