/**
 * @file cart.ts
 * @description 장바구니 조회 및 조작을 위한 Server Actions
 *
 * Clerk 인증을 사용하여 사용자별 장바구니를 관리합니다.
 * RLS가 비활성화되어 있으므로 애플리케이션 레벨에서 clerk_id로 필터링합니다.
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import type { CartItemWithProduct } from "@/types/cart";
import type { Product } from "@/types/product";

/**
 * 현재 사용자의 장바구니 아이템 조회 (상품 정보 JOIN)
 *
 * @returns 상품 정보를 포함한 장바구니 아이템 배열
 */
export async function getCartItems(): Promise<CartItemWithProduct[]> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다. 로그인해주세요.");
  }

  const supabase = createClerkSupabaseClient();

  // 장바구니 아이템과 상품 정보를 JOIN하여 조회
  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      clerk_id,
      product_id,
      quantity,
      created_at,
      updated_at,
      product:products(*)
    `
    )
    .eq("clerk_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cart items:", error);
    throw new Error(`장바구니 조회 실패: ${error.message}`);
  }

  // 타입 변환
  return (data || []).map((item: any) => ({
    id: item.id,
    clerk_id: item.clerk_id,
    product_id: item.product_id,
    quantity: item.quantity,
    created_at: item.created_at,
    updated_at: item.updated_at,
    product: item.product as Product,
  }));
}

/**
 * 장바구니에 상품 추가
 *
 * 이미 장바구니에 있는 상품이면 수량을 증가시킵니다.
 *
 * @param productId 상품 ID
 * @param quantity 추가할 수량 (기본값: 1)
 */
export async function addToCart(
  productId: string,
  quantity: number = 1
): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다. 로그인해주세요.");
  }

  if (quantity <= 0) {
    throw new Error("수량은 1개 이상이어야 합니다.");
  }

  // 상품 정보 조회 및 재고 확인
  const supabase = createClerkSupabaseClient();
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (productError || !product) {
    throw new Error("상품을 찾을 수 없습니다.");
  }

  // 현재 장바구니에 해당 상품이 있는지 확인
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("clerk_id", userId)
    .eq("product_id", productId)
    .single();

  const newQuantity = existingItem
    ? existingItem.quantity + quantity
    : quantity;

  // 재고 확인
  if (newQuantity > product.stock_quantity) {
    throw new Error(
      `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`
    );
  }

  // 장바구니에 추가 또는 수량 업데이트
  if (existingItem) {
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", existingItem.id);

    if (updateError) {
      console.error("Error updating cart item:", updateError);
      throw new Error(`장바구니 업데이트 실패: ${updateError.message}`);
    }
  } else {
    const { error: insertError } = await supabase
      .from("cart_items")
      .insert({
        clerk_id: userId,
        product_id: productId,
        quantity,
      });

    if (insertError) {
      console.error("Error adding to cart:", insertError);
      throw new Error(`장바구니 추가 실패: ${insertError.message}`);
    }
  }
}

/**
 * 장바구니 아이템 수량 변경
 *
 * @param cartItemId 장바구니 아이템 ID
 * @param quantity 변경할 수량
 */
export async function updateCartItem(
  cartItemId: string,
  quantity: number
): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다. 로그인해주세요.");
  }

  if (quantity <= 0) {
    throw new Error("수량은 1개 이상이어야 합니다.");
  }

  const supabase = createClerkSupabaseClient();

  // 장바구니 아이템 조회 및 권한 확인
  const { data: cartItem, error: fetchError } = await supabase
    .from("cart_items")
    .select("*, product:products(*)")
    .eq("id", cartItemId)
    .eq("clerk_id", userId)
    .single();

  if (fetchError || !cartItem) {
    throw new Error("장바구니 아이템을 찾을 수 없습니다.");
  }

  const product = cartItem.product as Product;

  // 재고 확인
  if (quantity > product.stock_quantity) {
    throw new Error(
      `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`
    );
  }

  // 수량 업데이트
  const { error: updateError } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
    .eq("clerk_id", userId);

  if (updateError) {
    console.error("Error updating cart item:", updateError);
    throw new Error(`장바구니 업데이트 실패: ${updateError.message}`);
  }
}

/**
 * 장바구니에서 아이템 삭제
 *
 * @param cartItemId 장바구니 아이템 ID
 */
export async function removeFromCart(cartItemId: string): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다. 로그인해주세요.");
  }

  const supabase = createClerkSupabaseClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId)
    .eq("clerk_id", userId);

  if (error) {
    console.error("Error removing cart item:", error);
    throw new Error(`장바구니 삭제 실패: ${error.message}`);
  }
}

/**
 * 장바구니 전체 비우기
 *
 * 주문 완료 후 사용합니다.
 */
export async function clearCart(): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다. 로그인해주세요.");
  }

  const supabase = createClerkSupabaseClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("clerk_id", userId);

  if (error) {
    console.error("Error clearing cart:", error);
    throw new Error(`장바구니 비우기 실패: ${error.message}`);
  }
}

/**
 * 장바구니 아이템 개수 조회
 *
 * 네비게이션 바의 장바구니 아이콘 배지에 사용됩니다.
 *
 * @returns 장바구니 아이템 개수
 */
export async function getCartItemCount(): Promise<number> {
  const { userId } = await auth();

  if (!userId) {
    return 0;
  }

  const supabase = createClerkSupabaseClient();

  const { count, error } = await supabase
    .from("cart_items")
    .select("*", { count: "exact", head: true })
    .eq("clerk_id", userId);

  if (error) {
    console.error("Error counting cart items:", error);
    return 0;
  }

  return count || 0;
}

