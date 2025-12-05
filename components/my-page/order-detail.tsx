/**
 * @file order-detail.tsx
 * @description 주문 상세 컴포넌트
 *
 * 주문의 상세 정보를 표시하는 클라이언트 컴포넌트입니다.
 * 주문 기본 정보, 배송지 정보, 주문 메모, 주문 상품 목록을 포함합니다.
 */

"use client";

import Link from "next/link";
import type { OrderWithItems } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Calendar, Package, MapPin, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderDetailProps {
  order: OrderWithItems;
}

/**
 * 주문 상태에 따른 배지 스타일 및 텍스트 반환
 */
function getOrderStatusBadge(status: OrderWithItems["status"]) {
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
 * 주문 상세 컴포넌트
 */
export function OrderDetail({ order }: OrderDetailProps) {
  const statusBadge = getOrderStatusBadge(order.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 뒤로가기 버튼 */}
      <Link href="/my-page">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          주문 목록으로
        </Button>
      </Link>

      <h1 className="text-2xl font-bold mb-6">주문 상세</h1>

      <div className="space-y-6">
        {/* 주문 기본 정보 */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
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
              <p className="text-sm text-muted-foreground">총 주문 금액</p>
              <p className="text-2xl font-bold">
                {formatPrice(order.total_amount)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 배송지 정보 */}
        {order.shipping_address && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <CardTitle className="text-lg">배송지 정보</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">수령인</p>
                <p className="font-medium">{order.shipping_address.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">연락처</p>
                <p className="font-medium">{order.shipping_address.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">우편번호</p>
                <p className="font-medium">{order.shipping_address.postalCode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">주소</p>
                <p className="font-medium">{order.shipping_address.address}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 주문 메모 */}
        {order.order_note && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <CardTitle className="text-lg">주문 메모</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{order.order_note}</p>
            </CardContent>
          </Card>
        )}

        {/* 주문 상품 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <CardTitle className="text-lg">주문 상품</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="font-medium mb-1">{item.product_name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>수량: {item.quantity}개</span>
                      <span>단가: {formatPrice(item.price)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

