/**
 * @file cart-icon.tsx
 * @description 장바구니 아이콘 컴포넌트
 *
 * 네비게이션 바에 표시할 장바구니 아이콘과 아이템 개수 배지를 제공합니다.
 * Client Component로 구현되어 클라이언트에서 실시간으로 장바구니 개수를 표시합니다.
 */

"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

/**
 * 장바구니 아이콘 컴포넌트
 */
export function CartIcon() {
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useClerkSupabaseClient();
  const { user } = useUser();

  useEffect(() => {
    async function fetchCartCount() {
      if (!user) {
        setItemCount(0);
        setIsLoading(false);
        return;
      }

      try {
        const { count, error } = await supabase
          .from("cart_items")
          .select("*", { count: "exact", head: true })
          .eq("clerk_id", user.id);

        if (error) {
          console.error("Error counting cart items:", error);
          setItemCount(0);
        } else {
          setItemCount(count || 0);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
        setItemCount(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCartCount();
  }, [supabase, user]);

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center"
      aria-label={isLoading ? "장바구니" : `장바구니 (${itemCount}개)`}
    >
      <ShoppingCart className="h-6 w-6" />
      {!isLoading && itemCount > 0 && (
        <span
          className={cn(
            "absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-semibold text-destructive-foreground"
          )}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}

