/**
 * @file page.tsx
 * @description 마이페이지 - 주문 내역 목록
 *
 * 사용자의 모든 주문 내역을 조회하여 목록으로 표시하는 페이지입니다.
 * 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트됩니다.
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserOrders } from "@/lib/supabase/queries/orders";
import { OrderList } from "@/components/my-page/order-list";

/**
 * 마이페이지 - 주문 내역 목록
 */
export default async function MyPage() {
  const { userId } = await auth();

  // 로그인 확인
  if (!userId) {
    redirect("/sign-in");
  }

  // 주문 목록 조회
  let orders;
  let error: Error | null = null;
  try {
    orders = await getUserOrders();
  } catch (err) {
    console.error("Error fetching user orders:", err);
    error = err instanceof Error ? err : new Error("주문 목록을 불러오는 중 오류가 발생했습니다.");
    orders = [];
  }

  return <OrderList orders={orders} error={error} />;
}

