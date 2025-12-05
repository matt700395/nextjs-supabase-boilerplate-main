/**
 * @file page.tsx
 * @description 주문 완료 페이지
 *
 * 주문이 성공적으로 생성되었음을 알리는 페이지입니다.
 * 주문 번호와 주문 정보를 표시합니다.
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, Package } from "lucide-react";
import { getOrderById } from "@/lib/supabase/queries/orders";
import { formatPrice } from "@/lib/utils";

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

/**
 * UUID의 앞 8자리만 추출 (주문 번호로 표시)
 */
function formatOrderNumber(orderId: string): string {
  return orderId.split("-")[0].toUpperCase();
}

/**
 * 주문 완료 페이지
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { userId } = await auth();

  // 로그인 확인
  if (!userId) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const orderId = params.orderId;

  if (!orderId) {
    redirect("/cart");
  }

  // 주문 정보 조회
  let order;
  try {
    order = await getOrderById(orderId);
  } catch (error) {
    console.error("Error fetching order:", error);
    redirect("/cart");
  }

  if (!order) {
    redirect("/cart");
  }

  const orderNumber = formatOrderNumber(order.id);
  const shippingAddress = order.shipping_address;

  return (
    <main className="min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 성공 메시지 */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
              <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            주문이 완료되었습니다!
          </h1>
          <p className="text-muted-foreground text-lg">
            주문번호: <span className="font-semibold text-foreground">{orderNumber}</span>
          </p>
        </div>

        {/* 주문 정보 카드 */}
        <div className="border rounded-lg p-6 bg-card mb-8">
          <h2 className="text-xl font-bold mb-6">주문 정보</h2>

          <div className="space-y-4">
            {/* 주문 번호 */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">주문 번호</span>
              <span className="font-medium">{orderNumber}</span>
            </div>

            {/* 총 금액 */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">총 금액</span>
              <span className="text-lg font-bold">{formatPrice(order.total_amount)}</span>
            </div>

            {/* 주문 상태 */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">주문 상태</span>
              <span className="font-medium">
                {order.status === "pending" && "결제 대기 중"}
              </span>
            </div>
          </div>
        </div>

        {/* 배송지 정보 */}
        {shippingAddress && (
          <div className="border rounded-lg p-6 bg-card mb-8">
            <h2 className="text-xl font-bold mb-4">배송지 정보</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">받는 분:</span>{" "}
                <span className="font-medium">{shippingAddress.name}</span>
              </p>
              <p>
                <span className="text-muted-foreground">연락처:</span>{" "}
                <span className="font-medium">{shippingAddress.phone}</span>
              </p>
              <p>
                <span className="text-muted-foreground">주소:</span>{" "}
                <span className="font-medium">
                  ({shippingAddress.postalCode}) {shippingAddress.address}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* 주문 상품 목록 */}
        {order.items && order.items.length > 0 && (
          <div className="border rounded-lg p-6 bg-card mb-8">
            <h2 className="text-xl font-bold mb-4">주문 상품</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price)} × {item.quantity}개
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 주문 메모 */}
        {order.order_note && (
          <div className="border rounded-lg p-6 bg-card mb-8">
            <h2 className="text-xl font-bold mb-2">주문 메모</h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {order.order_note}
            </p>
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="rounded-lg bg-muted p-6 mb-8">
          <p className="text-sm text-muted-foreground text-center">
            결제는 Phase 4에서 구현됩니다. 현재는 주문만 생성되었습니다.
            <br />
            주문 내역은 마이페이지에서 확인할 수 있습니다.
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button variant="outline" size="lg">
              <ShoppingBag className="h-5 w-5 mr-2" />
              쇼핑 계속하기
            </Button>
          </Link>
          {/* Phase 5에서 주문 내역 페이지 구현 예정 */}
          {/* <Link href="/my/orders">
            <Button size="lg">
              주문 내역 보기
            </Button>
          </Link> */}
        </div>
      </div>
    </main>
  );
}

