/**
 * @file page.tsx
 * @description 상품 목록 페이지
 *
 * 필터링, 정렬, 페이지네이션 기능을 포함한 상품 목록 페이지입니다.
 * URL 쿼리 파라미터를 기반으로 필터링, 정렬, 페이지네이션이 동작합니다.
 */

import { Suspense } from "react";
import { getPaginatedProducts } from "@/lib/supabase/queries/products";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductPagination } from "@/components/products/product-pagination";
import type { SortOption } from "@/components/products/product-filters";
import { getCategoryLabel } from "@/lib/constants/categories";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

/**
 * 정렬 옵션 문자열을 파싱하여 sortBy와 sortOrder 추출
 */
function parseSortOption(sort?: string): {
  sortBy: "created_at" | "price" | "name";
  sortOrder: "asc" | "desc";
} {
  const defaultSort: SortOption = "created_at_desc";

  if (!sort) {
    return {
      sortBy: "created_at",
      sortOrder: "desc",
    };
  }

  const [field, order] = sort.split("_");
  
  return {
    sortBy: (field as "created_at" | "price" | "name") || "created_at",
    sortOrder: (order as "asc" | "desc") || "desc",
  };
}

/**
 * 상품 목록 데이터 컴포넌트
 */
async function ProductsList({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const category = params.category;
  const sort = params.sort as SortOption | undefined;
  const page = parseInt(params.page || "1", 10);

  const { sortBy, sortOrder } = parseSortOption(sort);

  const { products, total, page: currentPage, totalPages } =
    await getPaginatedProducts({
      page: Math.max(1, page),
      pageSize: 12,
      category,
      sortBy,
      sortOrder,
    });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          {category ? getCategoryLabel(category) : "전체 상품"}
        </h1>
        <p className="text-muted-foreground">
          총 {total}개의 상품이 있습니다
        </p>
      </div>

      {/* 필터 및 정렬 */}
      <ProductFilters
        currentCategory={category}
        currentSort={sort || "created_at_desc"}
      />

      {/* 상품 그리드 */}
      {products.length > 0 ? (
        <>
          <ProductGrid
            products={products}
            columns={{ mobile: 1, tablet: 2, desktop: 4 }}
          />
          <ProductPagination
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            해당 조건에 맞는 상품이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * 로딩 상태 컴포넌트
 */
function ProductsLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-10 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-5 w-64 bg-muted rounded animate-pulse" />
      </div>
      <div className="mb-8">
        <div className="h-20 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div
            key={i}
            className="aspect-square bg-muted rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * 상품 목록 페이지
 */
export default function ProductsPage(props: ProductsPageProps) {
  return (
    <main className="min-h-[calc(100vh-80px)]">
      <Suspense fallback={<ProductsLoading />}>
        <ProductsList {...props} />
      </Suspense>
    </main>
  );
}
