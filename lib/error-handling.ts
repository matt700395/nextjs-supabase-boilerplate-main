/**
 * @file error-handling.ts
 * @description 에러 처리 유틸리티 함수
 * 
 * 애플리케이션 전반에서 사용할 수 있는 에러 처리 헬퍼 함수들을 제공합니다.
 */

/**
 * Supabase 에러를 사용자 친화적인 메시지로 변환
 */
export function getSupabaseErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Supabase 특정 에러 메시지 처리
    if (error.message.includes("NetworkError") || error.message.includes("fetch")) {
      return "네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.";
    }
    
    if (error.message.includes("timeout")) {
      return "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.";
    }
    
    if (error.message.includes("Missing Supabase")) {
      return "서버 설정에 문제가 있습니다. 관리자에게 문의해주세요.";
    }
    
    return error.message;
  }
  
  return "알 수 없는 오류가 발생했습니다.";
}

/**
 * 네트워크 에러인지 확인
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes("NetworkError") ||
      error.message.includes("fetch") ||
      error.message.includes("Failed to fetch") ||
      error.message.includes("Network request failed")
    );
  }
  return false;
}

/**
 * 타임아웃 에러인지 확인
 */
export function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes("timeout") || error.message.includes("Timeout");
  }
  return false;
}

/**
 * 에러를 사용자 친화적인 메시지로 변환
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return "네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.";
  }
  
  if (isTimeoutError(error)) {
    return "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.";
  }
  
  return getSupabaseErrorMessage(error);
}

