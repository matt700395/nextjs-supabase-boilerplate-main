/**
 * @file product-filters.tsx
 * @description 상품 필터 및 정렬 UI 컴포넌트
 *
 * 카테고리 필터링과 정렬 옵션을 제공하는 Client Component입니다.
 * URL 쿼리 파라미터와 동기화되어 브라우저 뒤로가기를 지원합니다.
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants/categories";
import { cn } from "@/lib/utils";

/**
 * 정렬 옵션 타입
 */
export type SortOption =
  | "created_at_desc"
  | "created_at_asc"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "created_at_desc", label: "최신순" },
  { value: "created_at_asc", label: "등록일 오래된순" },
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
  { value: "name_asc", label: "이름 가나다순" },
  { value: "name_desc", label: "이름 역순" },
];

interface ProductFiltersProps {
  currentCategory?: string;
  currentSort?: SortOption;
}

/**
 * 상품 필터 및 정렬 컴포넌트
 */
export function ProductFilters({
  currentCategory,
  currentSort = "created_at_desc",
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * URL 쿼리 파라미터 업데이트
   */
  const updateQuery = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    // 페이지는 항상 1로 리셋
    params.delete("page");

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* 카테고리 필터 */}
      <div>
        <h3 className="text-sm font-medium mb-3">카테고리</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!currentCategory ? "default" : "outline"}
            size="sm"
            onClick={() => updateQuery("category", null)}
          >
            전체
          </Button>
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={currentCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => updateQuery("category", category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium">정렬</h3>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={currentSort === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => updateQuery("sort", option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
