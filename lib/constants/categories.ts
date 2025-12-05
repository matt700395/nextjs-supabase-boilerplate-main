/**
 * @file categories.ts
 * @description 상품 카테고리 상수 정의
 *
 * 쇼핑몰에서 사용하는 카테고리 목록을 정의합니다.
 * 향후 DB에서 동적으로 가져올 수 있도록 확장 가능합니다.
 */

/**
 * 카테고리 정보 타입
 */
export interface Category {
  id: string;
  name: string;
  label: string; // 한국어 표시명
}

/**
 * 카테고리 목록
 */
export const CATEGORIES: Category[] = [
  { id: "electronics", name: "electronics", label: "전자제품" },
  { id: "clothing", name: "clothing", label: "의류" },
  { id: "books", name: "books", label: "도서" },
  { id: "food", name: "food", label: "식품" },
  { id: "sports", name: "sports", label: "스포츠" },
  { id: "beauty", name: "beauty", label: "뷰티" },
  { id: "home", name: "home", label: "생활/가정" },
];

/**
 * 카테고리 ID로 카테고리 정보 찾기
 */
export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.id === id);
}

/**
 * 카테고리 ID로 한국어 라벨 가져오기
 */
export function getCategoryLabel(id: string): string {
  const category = getCategoryById(id);
  return category?.label || id;
}
