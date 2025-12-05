import { test, expect } from '@playwright/test';

/**
 * 인증 플로우 E2E 테스트
 * 
 * Clerk를 통한 회원가입, 로그인, 로그아웃 및
 * 보호된 페이지 접근 제어를 테스트합니다.
 */
test.describe('인증 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('로그인하지 않은 사용자가 보호된 페이지 접근 시 로그인 페이지로 리다이렉트', async ({ page }) => {
    await test.step('장바구니 페이지 접근 시도', async () => {
      await page.goto('/cart');
      await expect(page).toHaveURL(/.*sign-in/);
    });

    await test.step('마이페이지 접근 시도', async () => {
      await page.goto('/my-page');
      await expect(page).toHaveURL(/.*sign-in/);
    });

    await test.step('주문 페이지 접근 시도', async () => {
      await page.goto('/checkout');
      await expect(page).toHaveURL(/.*sign-in/);
    });
  });

  test('로그인 버튼 클릭 시 Clerk 로그인 모달이 표시됨', async ({ page }) => {
    await test.step('로그인 버튼 찾기', async () => {
      const signInButton = page.getByRole('button', { name: '로그인' });
      await expect(signInButton).toBeVisible();
    });

    await test.step('로그인 버튼 클릭', async () => {
      await page.getByRole('button', { name: '로그인' }).click();
    });

    await test.step('Clerk 로그인 모달 표시 확인', async () => {
      // Clerk 모달이 표시되는지 확인 (Clerk의 접근성 속성 사용)
      const emailInput = page.getByLabel(/이메일|email/i);
      await expect(emailInput).toBeVisible({ timeout: 5000 });
    });
  });

  test('로그인 후 사용자 버튼이 표시됨', async ({ page }) => {
    // 이 테스트는 실제 Clerk 인증이 필요하므로
    // 테스트 환경에서 Clerk 테스트 계정을 사용하거나
    // 인증 상태를 모킹해야 합니다.
    // 
    // 실제 구현 시:
    // 1. Clerk 테스트 계정으로 로그인
    // 2. UserButton이 표시되는지 확인
    // 3. 마이페이지 링크가 표시되는지 확인
    
    test.skip(); // 실제 Clerk 인증이 필요하므로 스킵
  });

  test('로그인 후 마이페이지 접근 가능', async ({ page }) => {
    // 실제 구현 시:
    // 1. Clerk 테스트 계정으로 로그인
    // 2. 마이페이지로 이동
    // 3. 주문 내역 페이지가 표시되는지 확인
    
    test.skip(); // 실제 Clerk 인증이 필요하므로 스킵
  });
});

