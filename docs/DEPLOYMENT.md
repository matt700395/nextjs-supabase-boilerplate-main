# 배포 가이드

이 문서는 Next.js 애플리케이션을 Vercel에 배포하는 방법을 안내합니다.

## 사전 준비사항

배포 전에 다음 항목들이 준비되어 있어야 합니다:

1. **GitHub 저장소**: 코드가 GitHub에 푸시되어 있어야 합니다
2. **Vercel 계정**: [Vercel](https://vercel.com)에 가입되어 있어야 합니다
3. **Supabase 프로덕션 프로젝트**: 프로덕션용 Supabase 프로젝트가 생성되어 있어야 합니다
4. **Clerk 프로덕션 애플리케이션**: 프로덕션용 Clerk 애플리케이션이 설정되어 있어야 합니다

## 1. Vercel 프로젝트 생성

### 1.1 Vercel 대시보드에서 프로젝트 생성

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. **"Add New..."** → **"Project"** 클릭
3. GitHub 저장소 선택 또는 연결
4. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `pnpm build` (자동 감지)
   - **Output Directory**: `.next` (자동 감지)
   - **Install Command**: `pnpm install` (자동 감지)

### 1.2 환경 변수 설정

Vercel 프로젝트 설정에서 **"Environment Variables"** 섹션으로 이동하여 다음 환경 변수들을 추가합니다:

#### Clerk 환경 변수

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

**중요**: 프로덕션에서는 Clerk의 **Live Keys**를 사용해야 합니다. 개발용 Test Keys가 아닌 Live Keys를 사용하세요.

#### Supabase 환경 변수

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_STORAGE_BUCKET=uploads
```

**중요**: 
- `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 Supabase 프로덕션 프로젝트의 값입니다
- `SUPABASE_SERVICE_ROLE_KEY`는 절대 공개되지 않도록 주의하세요. 서버 사이드에서만 사용됩니다

#### Toss Payments 환경 변수 (선택사항)

결제 기능을 사용하는 경우:

```
NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY=test_ck_...
```

**참고**: 프로덕션에서도 테스트 모드를 사용하는 경우 테스트 키를 사용할 수 있습니다.

### 1.3 환경별 환경 변수 설정

Vercel에서는 환경별로 환경 변수를 설정할 수 있습니다:

- **Production**: 프로덕션 환경
- **Preview**: Pull Request 및 브랜치별 프리뷰 환경
- **Development**: 로컬 개발 환경 (사용 안 함)

각 환경에 맞는 값으로 환경 변수를 설정하세요.

## 2. Supabase 프로덕션 설정

### 2.1 프로덕션 프로젝트 생성

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. **"New Project"** 클릭
3. 프로젝트 정보 입력:
   - **Name**: 프로덕션 프로젝트 이름
   - **Database Password**: 안전한 비밀번호 생성
   - **Region**: `Northeast Asia (Seoul)` (한국 서비스용)
   - **Pricing Plan**: 필요에 따라 선택

### 2.2 데이터베이스 마이그레이션 적용

1. Supabase Dashboard → **SQL Editor** 메뉴
2. `supabase/migrations/` 디렉토리의 모든 마이그레이션 파일을 순서대로 실행
3. 또는 Supabase CLI를 사용하여 마이그레이션 적용:
   ```bash
   supabase db push
   ```

### 2.3 Storage 버킷 생성

1. Supabase Dashboard → **Storage** 메뉴
2. **"New bucket"** 클릭
3. 버킷 정보 입력:
   - **Name**: `uploads` (환경 변수와 동일하게)
   - **Public bucket**: 필요에 따라 선택

### 2.4 Clerk 통합 설정

1. Supabase Dashboard → **Authentication** → **Providers** 메뉴
2. 페이지 하단의 **"Third-Party Auth"** 섹션으로 스크롤
3. **"Add provider"** 클릭하고 **"Clerk"** 선택
4. Clerk Dashboard에서 복사한 **Clerk domain** 입력
5. **"Save"** 클릭

## 3. Clerk 프로덕션 설정

### 3.1 프로덕션 애플리케이션 생성

1. [Clerk Dashboard](https://dashboard.clerk.com/)에 로그인
2. **"Create application"** 클릭
3. 애플리케이션 정보 입력:
   - **Application name**: 프로덕션 애플리케이션 이름
   - **Sign-in options**: 필요한 인증 방식 선택

### 3.2 Supabase 통합 활성화

1. Clerk Dashboard → **Setup** → **Supabase** 메뉴
2. 설정 옵션 선택하고 **"Activate Supabase integration"** 클릭
3. **Clerk domain** 복사 (Supabase 설정에 사용)

### 3.3 Vercel 배포 URL 설정

1. Clerk Dashboard → **Domains** 메뉴
2. **"Add domain"** 클릭
3. Vercel 배포 URL 입력 (예: `your-app.vercel.app`)
4. DNS 설정에 따라 도메인 인증

## 4. 배포 실행

### 4.1 자동 배포

Vercel은 GitHub 저장소와 연결되면 자동으로 배포됩니다:

- **main/master 브랜치에 푸시**: 프로덕션 환경에 자동 배포
- **다른 브랜치에 푸시**: 프리뷰 환경에 자동 배포
- **Pull Request 생성**: 프리뷰 환경에 자동 배포

### 4.2 수동 배포

Vercel 대시보드에서 **"Deployments"** 탭으로 이동하여 수동으로 배포할 수 있습니다.

## 5. 배포 후 확인사항

### 5.1 기본 기능 확인

- [ ] 홈페이지 로드 확인
- [ ] 상품 목록 페이지 확인
- [ ] 상품 상세 페이지 확인
- [ ] 로그인/회원가입 기능 확인
- [ ] 장바구니 기능 확인
- [ ] 주문 생성 기능 확인
- [ ] 결제 위젯 로드 확인 (있는 경우)
- [ ] 마이페이지 주문 내역 확인

### 5.2 환경 변수 확인

Vercel 대시보드에서 모든 환경 변수가 올바르게 설정되었는지 확인:

- [ ] Clerk 환경 변수 확인
- [ ] Supabase 환경 변수 확인
- [ ] Toss Payments 환경 변수 확인 (있는 경우)

### 5.3 데이터베이스 연결 확인

- [ ] Supabase 프로덕션 프로젝트 연결 확인
- [ ] 데이터베이스 마이그레이션 적용 확인
- [ ] Storage 버킷 생성 확인

### 5.4 인증 통합 확인

- [ ] Clerk 로그인/회원가입 동작 확인
- [ ] Clerk → Supabase 사용자 동기화 확인
- [ ] 보호된 페이지 접근 제어 확인

## 6. 문제 해결

### 6.1 빌드 실패

**문제**: Vercel 빌드가 실패하는 경우

**해결 방법**:
1. Vercel 대시보드의 **"Deployments"** 탭에서 빌드 로그 확인
2. 로컬에서 `pnpm build` 실행하여 빌드 에러 확인
3. TypeScript 에러, 린터 에러 수정
4. 환경 변수 누락 확인

### 6.2 환경 변수 누락

**문제**: 런타임 에러가 발생하는 경우

**해결 방법**:
1. Vercel 대시보드에서 환경 변수 설정 확인
2. `NEXT_PUBLIC_` 접두사가 있는 변수는 클라이언트에서 사용 가능
3. 서버 사이드 전용 변수는 `NEXT_PUBLIC_` 접두사 없이 설정

### 6.3 Supabase 연결 실패

**문제**: Supabase 데이터를 불러오지 못하는 경우

**해결 방법**:
1. Supabase 프로덕션 프로젝트 URL과 키 확인
2. RLS 정책 확인 (개발 환경에서는 비활성화되어 있을 수 있음)
3. 네트워크 연결 확인

### 6.4 Clerk 인증 실패

**문제**: 로그인/회원가입이 동작하지 않는 경우

**해결 방법**:
1. Clerk 프로덕션 키 확인
2. Vercel 배포 URL이 Clerk에 등록되어 있는지 확인
3. Clerk → Supabase 통합 설정 확인

## 7. 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Supabase 배포 가이드](https://supabase.com/docs/guides/hosting)
- [Clerk 배포 가이드](https://clerk.com/docs/deployments/overview)

## 8. 환경 변수 체크리스트

배포 전 다음 환경 변수들이 모두 설정되어 있는지 확인하세요:

### 필수 환경 변수

- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_STORAGE_BUCKET`

### 선택적 환경 변수

- [ ] `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY` (결제 기능 사용 시)

## 9. 프로덕션 체크리스트

배포 전 최종 확인:

- [ ] 모든 환경 변수 설정 완료
- [ ] Supabase 프로덕션 프로젝트 생성 및 마이그레이션 적용
- [ ] Clerk 프로덕션 애플리케이션 생성 및 통합 설정
- [ ] 로컬에서 `pnpm build` 성공 확인
- [ ] 로컬에서 `pnpm start` 실행하여 프로덕션 빌드 확인
- [ ] 주요 기능 수동 테스트 완료
- [ ] 에러 처리 및 빈 상태 UI 확인
- [ ] 반응형 디자인 확인

