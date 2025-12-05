/**
 * @file route.ts
 * @description Toss Payments 결제 승인 API 라우트
 *
 * 클라이언트에서 전달받은 결제 정보를 검증하고 Toss Payments API를 통해 결제를 승인합니다.
 * 승인 성공 시 주문 상태를 'confirmed'로 업데이트합니다.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrderById, updateOrderStatus } from "@/lib/supabase/queries/orders";
import type { PaymentConfirmRequest } from "@/types/order";

/**
 * Toss Payments 결제 승인 API 호출
 *
 * @param paymentKey 결제 키
 * @param orderId 주문 ID
 * @param amount 결제 금액
 * @returns 결제 승인 결과
 */
async function confirmPaymentWithToss(
  paymentKey: string,
  orderId: string,
  amount: number
) {
  const secretKey = process.env.TOSS_SECRET_KEY;

  if (!secretKey) {
    throw new Error("TOSS_SECRET_KEY 환경변수가 설정되지 않았습니다.");
  }

  // Toss Payments API 엔드포인트 (테스트 모드)
  const apiUrl = `https://api.tosspayments.com/v1/payments/${paymentKey}`;

  // Basic 인증을 위한 Base64 인코딩
  const authHeader = Buffer.from(`${secretKey}:`).toString("base64");

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId,
      amount,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `결제 승인 실패: ${errorData.message || response.statusText}`
    );
  }

  return await response.json();
}

/**
 * POST /api/payments/confirm
 *
 * 결제 승인 요청 처리
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 요청 본문 파싱
    const body: PaymentConfirmRequest = await request.json();
    const { paymentKey, orderId, amount } = body;

    // 필수 필드 검증
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: "결제 정보가 올바르지 않습니다." },
        { status: 400 }
      );
    }

    // 주문 조회 및 권한 확인
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "주문을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 주문 소유자 확인
    if (order.clerk_id !== userId) {
      return NextResponse.json(
        { error: "권한이 없습니다." },
        { status: 403 }
      );
    }

    // 주문 상태 확인 (pending 상태만 결제 가능)
    if (order.status !== "pending") {
      return NextResponse.json(
        { error: `이미 처리된 주문입니다. (현재 상태: ${order.status})` },
        { status: 400 }
      );
    }

    // 결제 금액 검증
    if (order.total_amount !== amount) {
      console.error(
        `결제 금액 불일치: 주문 금액 ${order.total_amount}, 결제 금액 ${amount}`
      );
      return NextResponse.json(
        { error: "결제 금액이 주문 금액과 일치하지 않습니다." },
        { status: 400 }
      );
    }

    // Toss Payments API를 통한 결제 승인
    console.log(`[Payment] 결제 승인 시도: orderId=${orderId}, amount=${amount}`);
    const paymentResult = await confirmPaymentWithToss(
      paymentKey,
      orderId,
      amount
    );

    // 결제 승인 성공 시 주문 상태 업데이트
    await updateOrderStatus(orderId, "confirmed");

    console.log(`[Payment] 결제 승인 완료: orderId=${orderId}`);

    return NextResponse.json({
      success: true,
      orderId,
      paymentKey,
      amount,
      paymentResult,
    });
  } catch (error) {
    console.error("[Payment] 결제 승인 오류:", error);

    const errorMessage =
      error instanceof Error ? error.message : "결제 승인 중 오류가 발생했습니다.";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

