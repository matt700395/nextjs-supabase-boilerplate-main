/**
 * @file page.tsx
 * @description 마이페이지 - 주문 상세
 *
 * 특정 주문의 상세 정보를 조회하여 표시하는 페이지입니다.
 * 주문 정보, 배송지 정보, 주문 상품 목록을 포함합니다.
 * 로그인하지 않은 사용자나 권한이 없는 주문 접근 시 적절히 처리합니다.
 */

import { redirect, notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getOrderById } from "@/lib/supabase/queries/orders";
import { OrderDetail } from "@/components/my-page/order-detail";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 주문 상세 페이지
 */
export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { userId } = await auth();
  const { id } = await params;

  // 로그인 확인
  if (!userId) {
    redirect("/sign-in");
  }

  // 주문 조회
  let order;
  try {
    order = await getOrderById(id);
  } catch (error) {
    console.error("Error fetching order:", error);
    // 에러 발생 시 404 처리
    notFound();
  }

  // 주문이 없거나 권한이 없는 경우
  if (!order) {
    notFound();
  }

  return <OrderDetail order={order} />;
}

