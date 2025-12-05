/**
 * 테스트용 사용자 데이터
 * 
 * E2E 테스트에서 사용할 테스트 계정 정보를 관리합니다.
 * 실제 테스트 환경에서는 Clerk 테스트 계정을 사용하거나,
 * 테스트 전용 계정을 생성하여 사용합니다.
 */

export const TEST_USERS = {
  valid: {
    email: 'test@example.com',
    password: 'TestPassword123!',
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
};

/**
 * 테스트용 Clerk 사용자 정보
 * 실제 테스트 시 Clerk 대시보드에서 생성한 테스트 계정 정보로 교체
 */
export const CLERK_TEST_USER = {
  email: process.env.CLERK_TEST_EMAIL || 'test@example.com',
  password: process.env.CLERK_TEST_PASSWORD || 'TestPassword123!',
};

