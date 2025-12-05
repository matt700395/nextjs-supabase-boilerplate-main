/**
 * @file page.tsx
 * @description 장바구니 페이지
 *
 * 사용자의 장바구니 아이템을 표시하고 관리할 수 있는 페이지입니다.
 * 로그인이 필요하며, 비로그인 시 로그인 페이지로 리다이렉트됩니다.
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCartItems } from "@/lib/supabase/queries/cart";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

/**
 * 장바구니 페이지
 */
export default async function CartPage() {
  const { userId } = await auth();

  // 로그인 확인
  if (!userId) {
    redirect("/sign-in");
  }

  let cartItems;
  try {
    cartItems = await getCartItems();
  } catch (error) {
    console.error("Error fetching cart items:", error);
    cartItems = [];
  }

  return (
    <main className="min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold tracking-tight mb-8">장바구니</h1>

        {cartItems.length === 0 ? (
          /* 빈 장바구니 */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground/30 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">장바구니가 비어있습니다</h2>
            <p className="text-muted-foreground mb-6">
              원하는 상품을 장바구니에 담아보세요
            </p>
            <Link href="/products">
              <Button>상품 둘러보기</Button>
            </Link>
          </div>
        ) : (
          /* 장바구니 아이템 목록 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 장바구니 아이템 목록 */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* 장바구니 요약 */}
            <div className="lg:col-span-1">
              <CartSummary items={cartItems} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

