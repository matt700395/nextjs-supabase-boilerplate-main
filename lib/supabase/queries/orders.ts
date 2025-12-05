/**
 * @file orders.ts
 * @description 주문 조회 및 생성을 위한 Server Actions
 *
 * Clerk 인증을 사용하여 사용자별 주문을 관리합니다.
 * RLS가 비활성화되어 있으므로 애플리케이션 레벨에서 clerk_id로 필터링합니다.
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import type {
  Order,
  OrderItem,
  OrderWithItems,
  CreateOrderInput,
  ShippingAddress,
  OrderStatus,
} from "@/types/order";
import type { CartItemWithProduct } from "@/types/cart";
import { clearCart } from "./cart";

/**
 * 주문 생성
 *
 * 장바구니 아이템을 주문으로 변환하고, orders와 order_items 테이블에 저장합니다.
 * 주문 완료 후 장바구니를 비웁니다.
 *
 * @param cartItems 장바구니 아이템 목록 (상품 정보 포함)
 * @param shippingAddress 배송지 정보
 * @param orderNote 주문 메모 (선택)
 * @returns 생성된 주문 ID
 */
export async function createOrder(
  cartItems: CartItemWithProduct[],
  shippingAddress: ShippingAddress,
  orderNote?: string | null
): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다. 로그인해주세요.");
  }

  if (!cartItems || cartItems.length === 0) {
    throw new Error("장바구니가 비어있습니다.");
  }

  const supabase = createClerkSupabaseClient();

  // 배송지 정보 검증
  if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.postalCode || !shippingAddress.address) {
    throw new Error("배송지 정보를 모두 입력해주세요.");
  }

  // 총 금액 계산 및 재고 재확인
  let totalAmount = 0;
  for (const item of cartItems) {
    const product = item.product;

    // 재고 확인
    if (item.quantity > product.stock_quantity) {
      throw new Error(
        `재고가 부족합니다: ${product.name} (현재 재고: ${product.stock_quantity}개, 주문 수량: ${item.quantity}개)`
      );
    }

    // 상품 활성화 확인
    if (!product.is_active) {
      throw new Error(`판매 중인 상품이 아닙니다: ${product.name}`);
    }

    totalAmount += product.price * item.quantity;
  }

  // 주문 생성 (트랜잭션)
  // 1. orders 테이블에 주문 생성
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      clerk_id: userId,
      total_amount: totalAmount,
      status: "pending",
      shipping_address: shippingAddress as any, // JSONB 타입
      order_note: orderNote || null,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("Error creating order:", orderError);
    throw new Error(`주문 생성 실패: ${orderError?.message || "알 수 없는 오류"}`);
  }

  // 2. order_items 테이블에 주문 상세 아이템 생성
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
  }));

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (orderItemsError) {
    console.error("Error creating order items:", orderItemsError);
    // 주문 삭제 시도 (롤백)
    await supabase.from("orders").delete().eq("id", order.id);
    throw new Error(`주문 상세 생성 실패: ${orderItemsError.message}`);
  }

  // 3. 주문 완료 후 장바구니 비우기
  try {
    await clearCart();
  } catch (error) {
    console.error("Error clearing cart after order:", error);
    // 장바구니 비우기 실패는 주문에 영향을 주지 않음 (로그만 남김)
  }

  return order.id;
}

/**
 * 주문 상세 조회 (주문 아이템 포함)
 *
 * @param orderId 주문 ID
 * @returns 주문 정보 및 주문 아이템 목록
 */
export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다. 로그인해주세요.");
  }

  const supabase = createClerkSupabaseClient();

  // 주문 조회 (권한 확인)
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("clerk_id", userId)
    .single();

  if (orderError || !order) {
    if (orderError?.code === "PGRST116") {
      return null; // 주문을 찾을 수 없음
    }
    console.error("Error fetching order:", orderError);
    throw new Error(`주문 조회 실패: ${orderError?.message || "알 수 없는 오류"}`);
  }

  // 주문 아이템 조회
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (itemsError) {
    console.error("Error fetching order items:", itemsError);
    throw new Error(`주문 아이템 조회 실패: ${itemsError.message}`);
  }

  return {
    ...(order as Order),
    items: (items || []) as OrderItem[],
  };
}

/**
 * 사용자 주문 목록 조회
 *
 * @returns 사용자의 모든 주문 목록 (최신순)
 */
export async function getUserOrders(): Promise<Order[]> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다. 로그인해주세요.");
  }

  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("clerk_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user orders:", error);
    throw new Error(`주문 목록 조회 실패: ${error.message}`);
  }

  return (data || []) as Order[];
}

/**
 * 주문 상태 업데이트
 *
 * 주문의 상태를 업데이트합니다. 본인의 주문만 수정할 수 있습니다.
 *
 * @param orderId 주문 ID
 * @param status 새로운 주문 상태
 * @returns 업데이트된 주문 정보
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다. 로그인해주세요.");
  }

  const supabase = createClerkSupabaseClient();

  // 주문 조회 및 권한 확인
  const { data: existingOrder, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("clerk_id", userId)
    .single();

  if (fetchError || !existingOrder) {
    if (fetchError?.code === "PGRST116") {
      throw new Error("주문을 찾을 수 없습니다.");
    }
    console.error("Error fetching order:", fetchError);
    throw new Error(`주문 조회 실패: ${fetchError?.message || "알 수 없는 오류"}`);
  }

  // 주문 상태 업데이트
  const { data: updatedOrder, error: updateError } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .eq("clerk_id", userId)
    .select()
    .single();

  if (updateError || !updatedOrder) {
    console.error("Error updating order status:", updateError);
    throw new Error(`주문 상태 업데이트 실패: ${updateError?.message || "알 수 없는 오류"}`);
  }

  console.log(`Order ${orderId} status updated to ${status}`);

  return updatedOrder as Order;
}

