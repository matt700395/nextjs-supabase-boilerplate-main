/**
 * @file cart.ts
 * @description 장바구니 관련 TypeScript 타입 정의
 *
 * Supabase cart_items 테이블 스키마 기반으로 정의된 타입입니다.
 */

import type { Product } from "./product";

/**
 * 장바구니 아이템 타입
 *
 * cart_items 테이블의 모든 컬럼을 포함합니다.
 */
export interface CartItem {
  id: string;
  clerk_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

/**
 * 상품 정보를 JOIN한 장바구니 아이템 타입
 *
 * 장바구니 페이지에서 사용하며, 상품 정보와 함께 표시합니다.
 */
export interface CartItemWithProduct extends CartItem {
  product: Product;
}

/**
 * 장바구니 요약 정보 타입
 */
export interface CartSummary {
  totalItems: number; // 총 아이템 개수
  totalQuantity: number; // 총 수량
  totalPrice: number; // 총 금액
}

