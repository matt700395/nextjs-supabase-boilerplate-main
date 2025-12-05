"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

/**
 * Next.js 15 Error Boundary
 * 
 * Next.js App Router의 전역 에러를 처리하는 컴포넌트입니다.
 * 서버 컴포넌트나 클라이언트 컴포넌트에서 발생한 에러를 포착합니다.
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (에러 모니터링 서비스에 전송 가능)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">문제가 발생했습니다</h1>
        <p className="text-muted-foreground text-lg mb-6">
          예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 다시 시도해주세요.
        </p>
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 p-4 bg-muted rounded-md text-sm text-left">
            <p className="font-semibold mb-2">에러 상세:</p>
            <pre className="whitespace-pre-wrap break-words">
              {error.message}
            </pre>
            {error.digest && (
              <p className="mt-2 text-xs text-muted-foreground">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="outline">
            다시 시도
          </Button>
          <Button onClick={() => window.location.href = "/"}>
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}

