"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error | null; resetError: () => void }>;
}

/**
 * React Error Boundary 컴포넌트
 * 
 * 애플리케이션의 예상치 못한 에러를 포착하여
 * 사용자에게 친화적인 에러 메시지를 표시합니다.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * 기본 에러 폴백 UI
 */
function DefaultErrorFallback({
  error,
  resetError,
}: {
  error: Error | null;
  resetError: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">문제가 발생했습니다</h2>
        <p className="text-muted-foreground mb-6">
          예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 다시 시도해주세요.
        </p>
        {process.env.NODE_ENV === "development" && error && (
          <div className="mb-6 p-4 bg-muted rounded-md text-sm text-left">
            <p className="font-semibold mb-2">에러 상세:</p>
            <pre className="whitespace-pre-wrap break-words">
              {error.message}
            </pre>
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={resetError} variant="outline">
            다시 시도
          </Button>
          <Button onClick={() => window.location.reload()}>
            페이지 새로고침
          </Button>
        </div>
      </div>
    </div>
  );
}

