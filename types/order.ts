/**
 * @file order.ts
 * @description 주문 관련 TypeScript 타입 정의
 *
 * Supabase orders 및 order_items 테이블 스키마 기반으로 정의된 타입입니다.
 */

/**
 * 배송지 정보 타입
 */
export interface ShippingAddress {
  name: string;
  phone: string;
  postalCode: string;
  address: string;
}

/**
 * 주문 상태 타입
 */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

/**
 * 주문 정보 타입
 *
 * orders 테이블의 모든 컬럼을 포함합니다.
 */
export interface Order {
  id: string;
  clerk_id: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: ShippingAddress | null;
  order_note: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 주문 상세 아이템 타입
 *
 * order_items 테이블의 모든 컬럼을 포함합니다.
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
}

/**
 * 주문 생성 입력 데이터 타입
 */
export interface CreateOrderInput {
  shippingAddress: ShippingAddress;
  orderNote?: string | null;
}

/**
 * 주문 아이템과 상품 정보를 포함한 주문 상세 타입
 */
export interface OrderWithItems extends Order {
  items: OrderItem[];
}

/**
 * 결제 수단 타입
 */
export type PaymentMethod =
  | "카드"
  | "가상계좌"
  | "계좌이체"
  | "휴대폰"
  | "토스페이"
  | "토스페이먼츠";

/**
 * 결제 정보 타입
 */
export interface PaymentInfo {
  paymentKey: string;
  orderId: string;
  amount: number;
  method?: PaymentMethod;
  approvedAt?: string;
}

/**
 * 결제 승인 요청 타입
 */
export interface PaymentConfirmRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

