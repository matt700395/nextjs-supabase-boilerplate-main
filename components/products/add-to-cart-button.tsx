/**
 * @file add-to-cart-button.tsx
 * @description 장바구니 담기 버튼 컴포넌트
 *
 * 상품 상세 페이지에서 사용하는 장바구니 담기 버튼입니다.
 * 재고 확인, 로그인 상태 확인 등을 처리합니다.
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/supabase/queries/cart";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

interface AddToCartButtonProps {
  productId: string;
  stockQuantity: number;
  disabled?: boolean;
}

/**
 * 장바구니 담기 버튼 컴포넌트
 */
export function AddToCartButton({
  productId,
  stockQuantity,
  disabled = false,
}: AddToCartButtonProps) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isOutOfStock = stockQuantity === 0;
  const isDisabled = disabled || isOutOfStock || isPending;

  /**
   * 장바구니에 추가
   */
  const handleAddToCart = () => {
    if (!isSignedIn) {
      // 로그인하지 않은 경우 로그인 페이지로 이동
      router.push("/sign-in");
      return;
    }

    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        await addToCart(productId, 1);
        setSuccess(true);
        router.refresh(); // 네비게이션 바의 장바구니 개수 업데이트

        // 성공 메시지 2초 후 제거
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "장바구니 추가에 실패했습니다.");
      }
    });
  };

  if (!isSignedIn) {
    return (
      <Link href="/sign-in" className="w-full">
        <Button size="lg" className="w-full" variant="outline">
          로그인 후 장바구니에 담기
        </Button>
      </Link>
    );
  }

  return (
    <div className="w-full">
      <Button
        size="lg"
        className="w-full"
        disabled={isDisabled}
        onClick={handleAddToCart}
        aria-label="장바구니에 담기"
      >
        {isOutOfStock ? (
          "품절"
        ) : isPending ? (
          "처리 중..."
        ) : success ? (
          "담기 완료!"
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 mr-2" />
            장바구니에 담기
          </>
        )}
      </Button>

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-2 text-sm text-destructive text-center">{error}</p>
      )}

      {/* 성공 메시지 */}
      {success && (
        <p className="mt-2 text-sm text-green-600 text-center">
          장바구니에 추가되었습니다!
        </p>
      )}

      {/* 재고 부족 메시지 */}
      {isOutOfStock && (
        <p className="mt-2 text-sm text-destructive text-center">
          현재 품절된 상품입니다.
        </p>
      )}
    </div>
  );
}

