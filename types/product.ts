/**
 * @file product.ts
 * @description 상품 관련 TypeScript 타입 정의
 *
 * Supabase products 테이블 스키마 기반으로 정의된 타입입니다.
 */

/**
 * 상품 데이터 타입
 * 
 * products 테이블의 모든 컬럼을 포함합니다.
 */
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 상품 카드에 표시할 최소 정보 타입
 */
export interface ProductCardData {
  id: string;
  name: string;
  price: number;
  category: string | null;
  stock_quantity: number;
  imageUrl?: string | null;
}

/**
 * 상품 조회 옵션 타입
 */
export interface GetProductsOptions {
  limit?: number;
  offset?: number;
  category?: string;
  sortBy?: 'created_at' | 'price' | 'name';
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
}

/**
 * 페이지네이션된 상품 조회 결과 타입
 */
export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}


