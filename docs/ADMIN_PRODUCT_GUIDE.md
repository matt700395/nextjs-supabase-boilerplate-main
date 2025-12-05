# 어드민 상품 등록 가이드

이 문서는 Supabase 대시보드에서 상품을 직접 등록하고 관리하는 방법을 설명합니다.

## 목차

1. [Supabase 대시보드 접근](#supabase-대시보드-접근)
2. [상품 테이블 구조](#상품-테이블-구조)
3. [상품 등록 방법](#상품-등록-방법)
4. [상품 수정 및 삭제](#상품-수정-및-삭제)
5. [상품 스키마 상세](#상품-스키마-상세)

## Supabase 대시보드 접근

1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속하여 로그인합니다.
2. 프로젝트를 선택합니다.
3. 왼쪽 메뉴에서 **Table Editor**를 클릭합니다.

## 상품 테이블 구조

`products` 테이블은 다음 컬럼으로 구성되어 있습니다:

| 컬럼명           | 타입          | 설명         | 필수      | 기본값              |
| ---------------- | ------------- | ------------ | --------- | ------------------- |
| `id`             | UUID          | 상품 고유 ID | 자동 생성 | `gen_random_uuid()` |
| `name`           | TEXT          | 상품명       | 필수      | -                   |
| `description`    | TEXT          | 상품 설명    | 선택      | `NULL`              |
| `price`          | DECIMAL(10,2) | 가격 (원)    | 필수      | -                   |
| `category`       | TEXT          | 카테고리     | 선택      | `NULL`              |
| `stock_quantity` | INTEGER       | 재고 수량    | 선택      | `0`                 |
| `is_active`      | BOOLEAN       | 활성화 여부  | 선택      | `true`              |
| `created_at`     | TIMESTAMPTZ   | 생성일시     | 자동 생성 | `now()`             |
| `updated_at`     | TIMESTAMPTZ   | 수정일시     | 자동 생성 | `now()`             |

## 상품 등록 방법

### 1. Table Editor에서 상품 추가

1. Supabase Dashboard → **Table Editor** 메뉴
2. 왼쪽 테이블 목록에서 **`products`** 테이블 선택
3. 우측 상단 **Insert** → **Insert row** 클릭

### 2. 필수 필드 입력

다음 필드를 반드시 입력해야 합니다:

- **name**: 상품명 (예: "무선 블루투스 이어폰")
- **price**: 가격을 숫자로 입력 (예: `89000`)

### 3. 선택 필드 입력

다음 필드는 선택사항입니다:

- **description**: 상품 설명 (예: "고음질 노이즈 캔슬링 기능, 30시간 재생")
- **category**: 카테고리 ID (현재 지원 카테고리):
  - `electronics` - 전자제품
  - `clothing` - 의류
  - `books` - 도서
  - `food` - 식품
  - `sports` - 스포츠
  - `beauty` - 뷰티
  - `home` - 생활/가정
- **stock_quantity**: 재고 수량 (예: `150`)
- **is_active**: 활성화 여부 (`true` 또는 `false`)

### 4. 저장

모든 필드를 입력한 후:

- **Save** 버튼을 클릭하여 상품을 저장합니다.
- 자동으로 `id`, `created_at`, `updated_at`이 생성됩니다.

## 상품 수정 및 삭제

### 상품 수정

1. `products` 테이블에서 수정할 상품 행을 찾습니다.
2. 해당 셀을 클릭하여 값을 수정합니다.
3. **Save** 버튼을 클릭합니다.
4. `updated_at`이 자동으로 업데이트됩니다.

### 상품 삭제

1. `products` 테이블에서 삭제할 상품 행을 찾습니다.
2. 행 왼쪽의 체크박스를 선택합니다.
3. 우측 상단 **Delete** 버튼을 클릭합니다.
4. 확인 후 삭제됩니다.

**주의**: 상품을 삭제하면 해당 상품이 포함된 장바구니 항목(`cart_items`)도 함께 삭제됩니다 (CASCADE 설정).

## 상품 스키마 상세

### 가격 (price)

- 타입: `DECIMAL(10,2)`
- 최소값: `0` 이상
- 형식: 숫자만 입력 (예: `89000`, 소수점 허용: `89.50`)
- 단위: 원(KRW)

### 재고 수량 (stock_quantity)

- 타입: `INTEGER`
- 최소값: `0` 이상
- `0`일 경우 "품절"로 표시됩니다.

### 카테고리 (category)

현재 지원하는 카테고리 목록:

- `electronics` - 전자제품
- `clothing` - 의류
- `books` - 도서
- `food` - 식품
- `sports` - 스포츠
- `beauty` - 뷰티
- `home` - 생활/가정

카테고리는 대소문자를 구분합니다. 위 목록과 정확히 일치하는 값을 입력해야 합니다.

### 활성화 여부 (is_active)

- `true`: 상품 목록에 표시됨 (기본값)
- `false`: 상품 목록에서 숨김 처리 (삭제하지 않고 임시로 비활성화)

## 예시: 상품 등록

다음은 실제 상품 등록 예시입니다:

```
name: "프리미엄 노트북 가방"
description: "15인치 노트북 수납 가능, USB 충전 포트 내장"
price: 65000
category: electronics
stock_quantity: 80
is_active: true
```

## 주의사항

1. **가격 입력**: 가격은 숫자만 입력하세요. 쉼표나 통화 기호를 포함하지 마세요.
2. **카테고리**: 카테고리는 정확한 ID를 입력해야 합니다. 오타가 있으면 필터링이 작동하지 않습니다.
3. **재고 관리**: 재고 수량은 주기적으로 업데이트해야 합니다. 주문이 완료되면 재고를 차감해야 합니다 (현재는 수동 관리).
4. **이미지**: 현재는 상품 이미지 필드가 없습니다. 향후 `image_url` 컬럼이 추가될 예정입니다.

## 문제 해결

### 상품이 목록에 표시되지 않을 때

- `is_active`가 `true`인지 확인
- 가격이 `0` 이상인지 확인
- 상품이 정상적으로 저장되었는지 확인

### 카테고리 필터가 작동하지 않을 때

- 카테고리 ID가 정확한지 확인 (대소문자 구분)
- 카테고리 목록 (`lib/constants/categories.ts`)에 해당 카테고리가 정의되어 있는지 확인

## 추가 리소스

- [Supabase Table Editor 문서](https://supabase.com/docs/guides/database/tables)
- 프로젝트 스키마 파일: `supabase/migrations/db.sql`
