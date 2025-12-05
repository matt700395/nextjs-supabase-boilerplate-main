/**
 * @file page.tsx
 * @description 상품 상세 페이지
 *
 * 상품의 상세 정보(이름, 설명, 가격, 재고, 카테고리)를 표시하는 페이지입니다.
 * 존재하지 않는 상품에 대해서는 404 페이지를 표시합니다.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import { getProductById } from "@/lib/supabase/queries/products";
import { formatPrice } from "@/lib/utils";
import { getCategoryLabel } from "@/lib/constants/categories";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 상품 상세 페이지
 */
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const product = await getProductById(id);

  // 상품이 없거나 비활성화된 경우 404
  if (!product || !product.is_active) {
    notFound();
  }

  const isOutOfStock = product.stock_quantity === 0;

  return (
    <main className="min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <Link href="/products">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            상품 목록으로 돌아가기
          </Button>
        </Link>

        {/* 상품 상세 정보 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* 상품 이미지 영역 */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
            {/* 플레이스홀더 이미지 */}
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <Package className="h-32 w-32 text-muted-foreground/30" />
            </div>

            {/* 품절 배지 */}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <span className="rounded bg-destructive px-6 py-3 text-lg font-semibold text-white">
                  품절
                </span>
              </div>
            )}

            {/* 카테고리 배지 */}
            {product.category && (
              <div className="absolute left-4 top-4 rounded-md bg-background/90 px-3 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm">
                {getCategoryLabel(product.category)}
              </div>
            )}
          </div>

          {/* 상품 정보 영역 */}
          <div className="flex flex-col gap-6">
            {/* 상품명 */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                {product.name}
              </h1>
              {product.category && (
                <p className="text-muted-foreground">
                  카테고리: {getCategoryLabel(product.category)}
                </p>
              )}
            </div>

            {/* 가격 */}
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold">{formatPrice(product.price)}</p>
            </div>

            {/* 재고 상태 */}
            <div className="flex items-center gap-4">
              {isOutOfStock ? (
                <p className="text-lg font-medium text-destructive">품절</p>
              ) : (
                <p className="text-muted-foreground">
                  재고: {product.stock_quantity}개
                </p>
              )}
            </div>

            {/* 구분선 */}
            <div className="border-t" />

            {/* 상품 설명 */}
            {product.description && (
              <div>
                <h2 className="text-xl font-semibold mb-3">상품 설명</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* 장바구니 버튼 (Phase 3에서 기능 구현) */}
            <div className="mt-auto pt-6">
              <Button
                size="lg"
                className="w-full"
                disabled={isOutOfStock}
                aria-label="장바구니에 담기"
              >
                {isOutOfStock ? "품절" : "장바구니에 담기"}
              </Button>
              <p className="mt-2 text-xs text-center text-muted-foreground">
                장바구니 기능은 Phase 3에서 구현됩니다
              </p>
            </div>

            {/* 상품 정보 (생성일 등) */}
            <div className="pt-6 border-t">
              <div className="text-sm text-muted-foreground space-y-1">
                <p>상품 ID: {product.id}</p>
                <p>
                  등록일: {new Date(product.created_at).toLocaleDateString("ko-KR")}
                </p>
                {product.updated_at !== product.created_at && (
                  <p>
                    수정일: {new Date(product.updated_at).toLocaleDateString("ko-KR")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
