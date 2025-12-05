/**
 * @file checkout-success-client.tsx
 * @description 주문 완료 페이지 클라이언트 컴포넌트
 *
 * 결제 승인을 처리하는 클라이언트 컴포넌트입니다.
 * Toss Payments에서 리다이렉트된 경우 결제 승인 API를 호출합니다.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface CheckoutSuccessClientProps {
  paymentKey: string;
  orderId: string;
  amount: number;
}

/**
 * 주문 완료 페이지 클라이언트 컴포넌트
 */
export function CheckoutSuccessClient({
  paymentKey,
  orderId,
  amount,
}: CheckoutSuccessClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    /**
     * 결제 승인 처리
     */
    async function confirmPayment() {
      try {
        const response = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "결제 승인에 실패했습니다.");
        }

        setStatus("success");
        // 페이지 새로고침하여 주문 상태 업데이트 반영
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } catch (error) {
        console.error("결제 승인 오류:", error);
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "결제 승인 중 오류가 발생했습니다."
        );
      }
    }

    confirmPayment();
  }, [paymentKey, orderId, amount, router]);

  if (status === "processing") {
    return (
      <div className="rounded-lg bg-muted p-6 mb-8 border">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            결제 승인 처리 중...
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 mb-8 border border-destructive/20">
        <div className="flex items-center gap-3 mb-2">
          <XCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm font-medium text-destructive">결제 승인 실패</p>
        </div>
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-6 mb-8 border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            결제가 성공적으로 완료되었습니다.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

