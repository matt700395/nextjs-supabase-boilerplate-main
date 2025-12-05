import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiSupabaseFill } from "react-icons/ri";
import { Suspense } from "react";
import { getLatestProducts } from "@/lib/supabase/queries/products";
import { ProductGrid } from "@/components/products/product-grid";
import { ArrowRight } from "lucide-react";

/**
 * 홈페이지 상품 미리보기 컴포넌트
 */
async function FeaturedProducts() {
  const products = await getLatestProducts(8);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">최신 상품</h2>
            <p className="mt-2 text-muted-foreground">
              방금 추가된 새로운 상품들을 만나보세요
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="gap-2">
              모든 상품 보기
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <ProductGrid
          products={products}
          columns={{ mobile: 1, tablet: 2, desktop: 4 }}
        />
      </div>
    </section>
  );
}

/**
 * 로딩 상태 컴포넌트
 */
function ProductsLoading() {
  return (
    <section className="w-full py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-80px)]">
      {/* 상단 환영 섹션 */}
      <section className="flex items-center px-8 py-16 lg:py-24">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start lg:items-center">
          {/* 좌측: 환영 메시지 */}
          <div className="flex flex-col gap-8">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              SaaS 앱 템플릿에 오신 것을 환영합니다
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Next.js, Shadcn, Clerk, Supabase, TailwindCSS로 구동되는 완전한
              기능의 템플릿으로 다음 프로젝트를 시작하세요.
            </p>
          </div>

          {/* 우측: 버튼 세 개 세로 정렬 */}
          <div className="flex flex-col gap-6">
            <Link href="/instruments" className="w-full">
              <Button className="w-full h-28 flex items-center justify-center gap-4 text-xl shadow-lg hover:shadow-xl transition-shadow">
                <RiSupabaseFill className="w-8 h-8" />
                <span>Supabase 데이터 조회 테스트</span>
              </Button>
            </Link>
            <Link href="/storage-test" className="w-full">
              <Button
                className="w-full h-28 flex items-center justify-center gap-4 text-xl shadow-lg hover:shadow-xl transition-shadow"
                variant="outline"
              >
                <RiSupabaseFill className="w-8 h-8" />
                <span>Storage 파일 업로드 테스트</span>
              </Button>
            </Link>
            <Link href="/auth-test" className="w-full">
              <Button
                className="w-full h-28 flex items-center justify-center gap-4 text-xl shadow-lg hover:shadow-xl transition-shadow"
                variant="outline"
              >
                <RiSupabaseFill className="w-8 h-8" />
                <span>Clerk + Supabase 인증 연동</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 상품 미리보기 섹션 */}
      <Suspense fallback={<ProductsLoading />}>
        <FeaturedProducts />
      </Suspense>
    </main>
  );
}
