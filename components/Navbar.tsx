"use client";

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants/categories";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartIcon } from "@/components/cart/cart-icon";

const Navbar = () => {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold">
            SaaS Template
          </Link>

          {/* 카테고리 메뉴 */}
          <nav className="relative hidden md:block">
            <button
              className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              onMouseLeave={() => setIsCategoryMenuOpen(false)}
              aria-expanded={isCategoryMenuOpen}
              aria-haspopup="true"
            >
              카테고리
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isCategoryMenuOpen && "rotate-180"
                )}
              />
            </button>

            {/* 드롭다운 메뉴 */}
            {isCategoryMenuOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-48 bg-popover border rounded-md shadow-lg py-2 z-50"
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <Link
                  href="/products"
                  className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                  onClick={() => setIsCategoryMenuOpen(false)}
                >
                  전체 상품
                </Link>
                <div className="border-t my-1" />
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                    onClick={() => setIsCategoryMenuOpen(false)}
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>

        <div className="flex gap-4 items-center">
          {/* 장바구니 아이콘 */}
          <CartIcon />

          <SignedOut>
            <SignInButton mode="modal">
              <Button>로그인</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/my-page">
              <Button variant="ghost" className="hidden sm:inline-flex">
                마이페이지
              </Button>
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
