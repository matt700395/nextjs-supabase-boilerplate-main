/**
 * @file page.tsx
 * @description 결제 실패 페이지
 *
 * 결제가 실패했을 때 표시하는 페이지입니다.
 * 실패 이유를 표시하고 재시도 또는 장바구니로 돌아갈 수 있는 옵션을 제공합니다.
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import { getOrderById } from "@/lib/supabase/queries/orders";
import { formatPrice } from "@/lib/utils";

interface CheckoutFailurePageProps {
  searchParams: Promise<{ orderId?: string; message?: string; code?: string }>;
}

/**
 * 결제 실패 페이지
 */
export default async function CheckoutFailurePage({
  searchParams,
}: CheckoutFailurePageProps) {
  const { userId } = await auth();

  // 로그인 확인
  if (!userId) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const orderId = params.orderId;
  const errorMessage = params.message || "결제 처리 중 오류가 발생했습니다.";
  const errorCode = params.code;

  // 주문 정보 조회 (있는 경우)
  let order = null;
  if (orderId) {
    try {
      order = await getOrderById(orderId);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 실패 메시지 */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/10 p-4">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            결제에 실패했습니다
          </h1>
          <p className="text-muted-foreground text-lg">
            결제 처리 중 문제가 발생했습니다.
          </p>
        </div>

        {/* 에러 정보 카드 */}
        <div className="border rounded-lg p-6 bg-card mb-8">
          <h2 className="text-xl font-bold mb-4">오류 정보</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">오류 메시지</p>
              <p className="text-sm font-medium text-destructive">{errorMessage}</p>
            </div>
            {errorCode && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">오류 코드</p>
                <p className="text-sm font-mono">{errorCode}</p>
              </div>
            )}
            {orderId && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">주문 번호</p>
                <p className="text-sm font-mono">{orderId.slice(0, 8).toUpperCase()}</p>
              </div>
            )}
          </div>
        </div>

        {/* 주문 정보 (있는 경우) */}
        {order && (
          <div className="border rounded-lg p-6 bg-card mb-8">
            <h2 className="text-xl font-bold mb-4">주문 정보</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문 금액</span>
                <span className="font-medium">{formatPrice(order.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문 상태</span>
                <span className="font-medium">
                  {order.status === "pending" && "결제 대기 중"}
                  {order.status === "confirmed" && "결제 완료"}
                  {order.status === "cancelled" && "주문 취소"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="rounded-lg bg-muted p-6 mb-8">
          <p className="text-sm text-muted-foreground text-center">
            결제가 완료되지 않았습니다. 아래 버튼을 통해 다시 시도하거나 장바구니로 돌아가세요.
            <br />
            문제가 지속되면 고객센터로 문의해주세요.
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {orderId && (
            <Link href={`/checkout?retry=${orderId}`}>
              <Button size="lg" variant="outline">
                <ArrowLeft className="h-5 w-5 mr-2" />
                결제 다시 시도
              </Button>
            </Link>
          )}
          <Link href="/cart">
            <Button size="lg" variant="outline">
              <ShoppingBag className="h-5 w-5 mr-2" />
              장바구니로 돌아가기
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg">
              <ShoppingBag className="h-5 w-5 mr-2" />
              쇼핑 계속하기
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

