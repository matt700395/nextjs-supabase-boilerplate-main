/**
 * @file payment-widget.tsx
 * @description Toss Payments 결제 위젯 컴포넌트
 *
 * Toss Payments 위젯을 초기화하고 결제를 처리하는 컴포넌트입니다.
 * 결제 성공 시 서버로 결제 승인 요청을 보내고, 결과에 따라 리다이렉트합니다.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PaymentWidgetProps {
  orderId: string;
  amount: number;
  customerKey: string; // Clerk user ID
}

/**
 * 결제 위젯 컴포넌트
 *
 * @param orderId 주문 ID
 * @param amount 결제 금액
 * @param customerKey 고객 키 (Clerk user ID)
 */
export function PaymentWidget({
  orderId,
  amount,
  customerKey,
}: PaymentWidgetProps) {
  const router = useRouter();
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderPaymentMethods"]
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

  useEffect(() => {
    if (!clientKey) {
      setError("Toss Payments 클라이언트 키가 설정되지 않았습니다.");
      setIsLoading(false);
      return;
    }

    // 결제 위젯 초기화
    async function initPaymentWidget() {
      try {
        const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
        paymentWidgetRef.current = paymentWidget;

        // 결제 금액 설정
        await paymentWidget.updateAmount(amount);

        // 결제 수단 위젯 렌더링
        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          "#payment-widget",
          { value: amount },
          { variantKey: "DEFAULT" }
        );
        paymentMethodsWidgetRef.current = paymentMethodsWidget;

        // 약관 위젯 렌더링
        paymentWidget.renderAgreement("#agreement", {
          variantKey: "AGREEMENT",
        });

        setIsLoading(false);
      } catch (err) {
        console.error("결제 위젯 초기화 오류:", err);
        setError(
          err instanceof Error
            ? err.message
            : "결제 위젯을 초기화하는 중 오류가 발생했습니다."
        );
        setIsLoading(false);
      }
    }

    initPaymentWidget();

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (paymentMethodsWidgetRef.current) {
        paymentMethodsWidgetRef.current = null;
      }
      if (paymentWidgetRef.current) {
        paymentWidgetRef.current = null;
      }
    };
  }, [clientKey, customerKey, amount]);

  /**
   * 결제 요청 처리
   */
  const handlePayment = async () => {
    if (!paymentWidgetRef.current) {
      setError("결제 위젯이 초기화되지 않았습니다.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 결제 위젯을 통해 결제 요청
      await paymentWidgetRef.current.requestPayment({
        orderId,
        orderName: `주문 #${orderId.slice(0, 8).toUpperCase()}`,
        customerName: customerKey,
        successUrl: `${window.location.origin}/checkout/success?orderId=${orderId}`,
        failUrl: `${window.location.origin}/checkout/failure?orderId=${orderId}`,
      });
    } catch (err) {
      console.error("결제 요청 오류:", err);
      setError(
        err instanceof Error
          ? err.message
          : "결제 요청 중 오류가 발생했습니다."
      );
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">결제 위젯을 불러오는 중...</span>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 결제 수단 선택 영역 */}
      <div id="payment-widget" className="min-h-[400px]" />

      {/* 약관 동의 영역 */}
      <div id="agreement" />

      {/* 에러 메시지 */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* 결제하기 버튼 */}
      <Button
        onClick={handlePayment}
        size="lg"
        className="w-full"
        disabled={isProcessing || isLoading}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            결제 처리 중...
          </>
        ) : (
          `${amount.toLocaleString()}원 결제하기`
        )}
      </Button>
    </div>
  );
}

