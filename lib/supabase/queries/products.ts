/**
 * @file products.ts
 * @description 상품 조회를 위한 Server Component 함수
 *
 * Supabase에서 상품 데이터를 조회하는 함수들을 제공합니다.
 * RLS가 비활성화되어 있으므로 공개 데이터로 조회 가능합니다.
 */

import { createClient } from "@supabase/supabase-js";
import type {
  Product,
  GetProductsOptions,
  PaginatedProducts,
} from "@/types/product";

/**
 * Server Component에서 사용할 Supabase 클라이언트 생성
 * 공개 데이터 조회용 (인증 불필요)
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check your .env file:\n" +
      "- NEXT_PUBLIC_SUPABASE_URL\n" +
      "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createClient(supabaseUrl, supabaseKey);
}

/**
 * 활성화된 상품 목록 조회
 *
 * @param options 조회 옵션 (limit, offset, category, sortBy, sortOrder)
 * @returns 상품 목록
 */
export async function getProducts(
  options: GetProductsOptions = {}
): Promise<Product[]> {
  const {
    limit,
    offset,
    category,
    sortBy = "created_at",
    sortOrder = "desc",
    isActive = true,
  } = options;

  const supabase = getSupabaseClient();

  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", isActive);

  // 카테고리 필터링
  if (category) {
    query = query.eq("category", category);
  }

  // 정렬
  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  // 오프셋 및 개수 제한 (페이지네이션)
  if (limit) {
    if (offset !== undefined) {
      query = query.range(offset, offset + limit - 1);
    } else {
      query = query.limit(limit);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return (data as Product[]) || [];
}

/**
 * 상품 총 개수 조회 (페이지네이션용)
 *
 * @param options 조회 옵션 (category)
 * @returns 상품 총 개수
 */
export async function getProductsCount(
  options: { category?: string } = {}
): Promise<number> {
  const { category } = options;

  const supabase = getSupabaseClient();

  let query = supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  // 카테고리 필터링
  if (category) {
    query = query.eq("category", category);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error counting products:", error);
    throw new Error(`Failed to count products: ${error.message}`);
  }

  return count || 0;
}

/**
 * 페이지네이션된 상품 목록 조회
 *
 * @param options 조회 옵션 (page, pageSize, category, sortBy, sortOrder)
 * @returns 페이지네이션된 상품 목록 및 메타데이터
 */
export async function getPaginatedProducts(
  options: {
    page?: number;
    pageSize?: number;
    category?: string;
    sortBy?: "created_at" | "price" | "name";
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<PaginatedProducts> {
  const {
    page = 1,
    pageSize = 12,
    category,
    sortBy = "created_at",
    sortOrder = "desc",
  } = options;

  const offset = (page - 1) * pageSize;

  // 상품 목록 조회
  const products = await getProducts({
    limit: pageSize,
    offset,
    category,
    sortBy,
    sortOrder,
    isActive: true,
  });

  // 총 개수 조회
  const total = await getProductsCount({ category });

  const totalPages = Math.ceil(total / pageSize);

  return {
    products,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * 단일 상품 조회 (ID로)
 *
 * @param productId 상품 ID
 * @returns 상품 정보
 */
export async function getProductById(productId: string): Promise<Product | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // 데이터를 찾을 수 없음
      return null;
    }
    console.error("Error fetching product:", error);
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  return data as Product;
}

/**
 * 최신 상품 조회 (홈페이지용)
 *
 * @param limit 조회할 상품 개수 (기본값: 8)
 * @returns 최신 상품 목록
 */
export async function getLatestProducts(limit: number = 8): Promise<Product[]> {
  return getProducts({
    limit,
    sortBy: "created_at",
    sortOrder: "desc",
    isActive: true,
  });
}

/**
 * 모든 활성화된 상품 조회 (상품 목록 페이지용)
 *
 * @returns 모든 활성화된 상품 목록
 */
export async function getAllProducts(): Promise<Product[]> {
  return getProducts({
    isActive: true,
    sortBy: "created_at",
    sortOrder: "desc",
  });
}

/**
 * 카테고리별 상품 조회
 *
 * @param category 카테고리 이름
 * @returns 해당 카테고리의 상품 목록
 */
export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  return getProducts({
    category,
    isActive: true,
    sortBy: "created_at",
    sortOrder: "desc",
  });
}


