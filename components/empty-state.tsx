import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

/**
 * 빈 상태 컴포넌트
 * 
 * 데이터가 없을 때 표시하는 공통 UI 컴포넌트입니다.
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   icon={ShoppingBag}
 *   title="장바구니가 비어있습니다"
 *   description="원하는 상품을 장바구니에 담아보세요"
 *   action={{ label: "상품 둘러보기", href: "/products" }}
 * />
 * ```
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted/30 p-6 mb-4">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action && (
        <Link href={action.href}>
          <Button>{action.label}</Button>
        </Link>
      )}
    </div>
  );
}

