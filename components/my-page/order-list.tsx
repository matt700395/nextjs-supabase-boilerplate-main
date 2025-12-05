/**
 * @file order-list.tsx
 * @description 주문 목록 컴포넌트
 *
 * 사용자의 주문 내역을 카드 형태로 표시하는 클라이언트 컴포넌트입니다.
 * 각 주문 카드는 주문 번호, 일시, 상태, 금액, 상품 개수를 표시합니다.
 */

"use client";

import Link from "next/link";
import type { Order } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Package, Calendar, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderListProps {
  orders: Order[];
  error?: Error | null;
}

/**
 * 주문 상태에 따른 배지 스타일 및 텍스트 반환
 */
function getOrderStatusBadge(status: Order["status"]) {
  const statusConfig = {
    pending: {
      label: "대기 중",
      className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    },
    confirmed: {
      label: "확인됨",
      className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    },
    shipped: {
      label: "배송 중",
      className: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    },
    delivered: {
      label: "배송 완료",
      className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    },
    cancelled: {
      label: "취소됨",
      className: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  return config;
}

/**
 * 날짜를 한국어 형식으로 포맷팅
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
}

/**
 * 주문 ID의 앞 8자리만 반환 (가독성 향상)
 */
function formatOrderId(orderId: string): string {
  return orderId.substring(0, 8).toUpperCase();
}

/**
 * 주문 목록 컴포넌트
 */
export function OrderList({ orders, error }: OrderListProps) {
  // 에러 상태 표시
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">주문 내역</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-16 w-16 text-destructive/50 mb-4" />
            <p className="text-destructive font-medium mb-2">오류가 발생했습니다</p>
            <p className="text-muted-foreground text-center mb-6">
              {error.message || "주문 목록을 불러오는 중 오류가 발생했습니다."}
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              다시 시도
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 주문이 없을 때
  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">주문 내역</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-center">
              아직 주문 내역이 없습니다.
              <br />
              상품을 구매해보세요!
            </p>
            <Link
              href="/products"
              className="mt-6 text-primary hover:underline font-medium"
            >
              상품 보러가기 →
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">주문 내역</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusBadge = getOrderStatusBadge(order.status);

          return (
            <Link
              key={order.id}
              href={`/my-page/${order.id}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        주문번호: {formatOrderId(order.id)}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("shrink-0", statusBadge.className)}
                    >
                      {statusBadge.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        총 주문 금액
                      </p>
                      <p className="text-xl font-bold">
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-sm">상세 보기</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

