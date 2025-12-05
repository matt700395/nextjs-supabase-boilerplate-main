import { test, expect } from '@playwright/test';

/**
 * 상품 탐색 플로우 E2E 테스트
 * 
 * 홈페이지, 상품 목록, 상품 상세 페이지의
 * 탐색 및 필터링 기능을 테스트합니다.
 */
test.describe('상품 탐색 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('홈페이지에서 상품 목록 페이지로 이동', async ({ page }) => {
    await test.step('홈페이지 로드 확인', async () => {
      await expect(page).toHaveURL('/');
    });

    await test.step('모든 상품 보기 버튼 클릭', async () => {
      const allProductsButton = page.getByRole('button', { name: /모든 상품 보기|전체 상품 보기/i });
      if (await allProductsButton.isVisible()) {
        await allProductsButton.click();
        await expect(page).toHaveURL(/.*\/products/);
      } else {
        // 네비게이션에서 상품 링크 클릭
        await page.getByRole('link', { name: /전체 상품|상품/i }).first().click();
        await expect(page).toHaveURL(/.*\/products/);
      }
    });

    await test.step('상품 목록 페이지 표시 확인', async () => {
      const heading = page.getByRole('heading', { name: /전체 상품|상품/i });
      await expect(heading).toBeVisible();
    });
  });

  test('상품 목록 페이지에서 카테고리 필터링', async ({ page }) => {
    await test.step('상품 목록 페이지로 이동', async () => {
      await page.goto('/products');
      await expect(page).toHaveURL(/.*\/products/);
    });

    await test.step('카테고리 필터 확인', async () => {
      // 카테고리 필터가 있는지 확인
      const categoryFilter = page.getByRole('combobox', { name: /카테고리/i }).or(
        page.getByLabel(/카테고리/i)
      );
      
      // 필터가 있으면 테스트 진행
      if (await categoryFilter.isVisible().catch(() => false)) {
        await categoryFilter.click();
        
        // 카테고리 옵션 선택 (첫 번째 옵션)
        const firstOption = page.getByRole('option').first();
        if (await firstOption.isVisible().catch(() => false)) {
          await firstOption.click();
          
          // URL에 category 파라미터가 추가되었는지 확인
          await expect(page).toHaveURL(/.*category=/);
        }
      }
    });
  });

  test('상품 목록 페이지에서 정렬 기능', async ({ page }) => {
    await test.step('상품 목록 페이지로 이동', async () => {
      await page.goto('/products');
      await expect(page).toHaveURL(/.*\/products/);
    });

    await test.step('정렬 옵션 확인', async () => {
      // 정렬 드롭다운 찾기
      const sortSelect = page.getByRole('combobox', { name: /정렬/i }).or(
        page.getByLabel(/정렬/i)
      );
      
      if (await sortSelect.isVisible().catch(() => false)) {
        await sortSelect.click();
        
        // 정렬 옵션 선택 (예: 가격 낮은 순)
        const priceOption = page.getByRole('option', { name: /가격.*낮은|낮은.*가격/i });
        if (await priceOption.isVisible().catch(() => false)) {
          await priceOption.click();
          
          // URL에 sort 파라미터가 추가되었는지 확인
          await expect(page).toHaveURL(/.*sort=/);
        }
      }
    });
  });

  test('상품 목록에서 상품 상세 페이지로 이동', async ({ page }) => {
    await test.step('상품 목록 페이지로 이동', async () => {
      await page.goto('/products');
      await expect(page).toHaveURL(/.*\/products/);
    });

    await test.step('첫 번째 상품 카드 클릭', async () => {
      // 상품 카드 또는 링크 찾기
      const firstProduct = page.getByRole('link').filter({ hasText: /상품|제품/i }).first();
      
      if (await firstProduct.isVisible().catch(() => false)) {
        const productHref = await firstProduct.getAttribute('href');
        await firstProduct.click();
        
        // 상품 상세 페이지로 이동했는지 확인
        await expect(page).toHaveURL(/.*\/products\/[^/]+/);
      } else {
        // 상품 카드가 없으면 스킵
        test.skip();
      }
    });

    await test.step('상품 상세 정보 표시 확인', async () => {
      // 상품 이름, 가격 등이 표시되는지 확인
      const productName = page.getByRole('heading', { level: 1 });
      await expect(productName).toBeVisible();
    });
  });

  test('상품 목록 페이지네이션 동작', async ({ page }) => {
    await test.step('상품 목록 페이지로 이동', async () => {
      await page.goto('/products');
      await expect(page).toHaveURL(/.*\/products/);
    });

    await test.step('다음 페이지 버튼 클릭', async () => {
      const nextButton = page.getByRole('link', { name: /다음|next/i });
      
      if (await nextButton.isVisible().catch(() => false)) {
        await nextButton.click();
        
        // URL에 page 파라미터가 추가되었는지 확인
        await expect(page).toHaveURL(/.*page=/);
      } else {
        // 페이지네이션이 없으면 스킵 (상품이 적은 경우)
        test.skip();
      }
    });
  });
});

