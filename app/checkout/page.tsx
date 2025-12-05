/**
 * @file page.tsx
 * @description 주문 페이지
 *
 * 배송지 정보를 입력하고 주문을 생성하는 페이지입니다.
 * 장바구니 아이템이 없으면 장바구니 페이지로 리다이렉트됩니다.
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCartItems } from "@/lib/supabase/queries/cart";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";

/**
 * 주문 페이지
 */
export default async function CheckoutPage() {
  const { userId } = await auth();

  // 로그인 확인
  if (!userId) {
    redirect("/sign-in");
  }

  // 장바구니 아이템 조회
  let cartItems;
  try {
    cartItems = await getCartItems();
  } catch (error) {
    console.error("Error fetching cart items:", error);
    cartItems = [];
  }

  // 장바구니가 비어있으면 장바구니 페이지로 리다이렉트
  if (cartItems.length === 0) {
    redirect("/cart");
  }

  return (
    <main className="min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold tracking-tight mb-8">주문하기</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 배송지 입력 폼 */}
          <div>
            <CheckoutForm cartItems={cartItems} />
          </div>

          {/* 주문 요약 */}
          <div>
            <OrderSummary items={cartItems} />
          </div>
        </div>
      </div>
    </main>
  );
}

