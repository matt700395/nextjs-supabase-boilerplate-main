/**
 * @file checkout-form.tsx
 * @description 배송지 입력 및 주문 생성 폼 컴포넌트
 *
 * 배송지 정보를 입력받고 주문을 생성하는 폼입니다.
 * react-hook-form과 Zod를 사용하여 폼 검증을 수행합니다.
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CartItemWithProduct } from "@/types/cart";
import type { ShippingAddress } from "@/types/order";
import { createOrder } from "@/lib/supabase/queries/orders";

/**
 * 배송지 정보 폼 스키마
 */
const shippingFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  phone: z
    .string()
    .min(1, "전화번호를 입력해주세요.")
    .regex(/^[0-9-]+$/, "전화번호는 숫자와 하이픈(-)만 입력할 수 있습니다."),
  postalCode: z.string().min(1, "우편번호를 입력해주세요."),
  address: z.string().min(1, "주소를 입력해주세요."),
  orderNote: z.string().optional(),
});

type ShippingFormValues = z.infer<typeof shippingFormSchema>;

interface CheckoutFormProps {
  cartItems: CartItemWithProduct[];
}

/**
 * 주문 폼 컴포넌트
 */
export function CheckoutForm({ cartItems }: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      postalCode: "",
      address: "",
      orderNote: "",
    },
  });

  /**
   * 주문 생성
   */
  const onSubmit = async (data: ShippingFormValues) => {
    setError(null);

    startTransition(async () => {
      try {
        const shippingAddress: ShippingAddress = {
          name: data.name,
          phone: data.phone,
          postalCode: data.postalCode,
          address: data.address,
        };

        const orderId = await createOrder(
          cartItems,
          shippingAddress,
          data.orderNote || null
        );

        // 주문 완료 페이지로 리다이렉트
        router.push(`/checkout/success?orderId=${orderId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "주문 생성에 실패했습니다.");
        console.error("Order creation error:", err);
      }
    });
  };

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h2 className="text-xl font-bold mb-6">배송지 정보</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 이름 */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름 *</FormLabel>
                <FormControl>
                  <Input placeholder="홍길동" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 전화번호 */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>전화번호 *</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="010-1234-5678"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 우편번호 */}
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>우편번호 *</FormLabel>
                <FormControl>
                  <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 주소 */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>주소 *</FormLabel>
                <FormControl>
                  <Input placeholder="서울시 강남구 테헤란로 123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 주문 메모 */}
          <FormField
            control={form.control}
            name="orderNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>주문 메모 (선택)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="배송 시 요청사항을 입력해주세요."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 에러 메시지 */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* 주문하기 버튼 */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "주문 처리 중..." : "주문하기"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

