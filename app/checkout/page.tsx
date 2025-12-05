/**
 * @file page.tsx
 * @description 주문 페이지
 *
 * 배송지 정보를 입력하고 주문을 생성한 후 결제를 진행하는 페이지입니다.
 * 장바구니 아이템이 없으면 장바구니 페이지로 리다이렉트됩니다.
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCartItems } from "@/lib/supabase/queries/cart";
import { CheckoutPageClient } from "@/components/checkout/checkout-page-client";

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

  return <CheckoutPageClient cartItems={cartItems} userId={userId} />;
}

