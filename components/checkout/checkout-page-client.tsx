/**
 * @file checkout-page-client.tsx
 * @description 체크아웃 페이지 클라이언트 컴포넌트
 *
 * 주문 생성 및 결제 단계를 관리하는 클라이언트 컴포넌트입니다.
 */

"use client";

import { useState } from "react";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { PaymentWidget } from "@/components/payments/payment-widget";
import type { CartItemWithProduct } from "@/types/cart";

interface CheckoutPageClientProps {
  cartItems: CartItemWithProduct[];
  userId: string;
}

/**
 * 체크아웃 페이지 클라이언트 컴포넌트
 */
export function CheckoutPageClient({
  cartItems,
  userId,
}: CheckoutPageClientProps) {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);

  /**
   * 주문 생성 완료 핸들러
   */
  const handleOrderCreated = (createdOrderId: string, amount: number) => {
    setOrderId(createdOrderId);
    setPaymentAmount(amount);
  };

  // 결제 단계
  if (orderId && paymentAmount !== null) {
    return (
      <main className="min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold tracking-tight mb-8">결제하기</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 결제 위젯 */}
            <div>
              <div className="border rounded-lg p-6 bg-card">
                <h2 className="text-xl font-bold mb-6">결제 수단 선택</h2>
                <PaymentWidget
                  orderId={orderId}
                  amount={paymentAmount}
                  customerKey={userId}
                />
              </div>
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

  // 주문 생성 단계
  return (
    <main className="min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold tracking-tight mb-8">주문하기</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 배송지 입력 폼 */}
          <div>
            <CheckoutForm cartItems={cartItems} onOrderCreated={handleOrderCreated} />
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

