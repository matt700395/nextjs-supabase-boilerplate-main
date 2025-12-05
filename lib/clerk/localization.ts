import { koKR } from "@clerk/localizations";

/**
 * Clerk 한국어 로컬라이제이션 설정
 * 
 * 기본 koKR을 사용하거나, 커스텀 메시지로 오버라이드할 수 있습니다.
 * 
 * @see https://clerk.com/docs/guides/customizing-clerk/localization
 * 
 * @example 기본 사용
 * ```tsx
 * import { koreanLocalization } from '@/lib/clerk/localization';
 * 
 * <ClerkProvider localization={koreanLocalization}>
 *   ...
 * </ClerkProvider>
 * ```
 * 
 * @example 커스텀 에러 메시지
 * ```tsx
 * const customLocalization = {
 *   ...koKR,
 *   unstable__errors: {
 *     ...koKR.unstable__errors,
 *     not_allowed_access: '접근이 허용되지 않은 이메일 도메인입니다. 접근을 원하시면 이메일로 문의해주세요.',
 *   },
 * };
 * ```
 */
export const koreanLocalization = koKR;

/**
 * 커스텀 한국어 로컬라이제이션 예시
 * 
 * 특정 메시지를 브랜드에 맞게 커스터마이징할 수 있습니다.
 * 
 * @example
 * ```tsx
 * import { customKoreanLocalization } from '@/lib/clerk/localization';
 * 
 * <ClerkProvider localization={customKoreanLocalization}>
 *   ...
 * </ClerkProvider>
 * ```
 */
export const customKoreanLocalization = {
  ...koKR,
  // 에러 메시지 커스터마이징 예시
  // unstable__errors: {
  //   ...koKR.unstable__errors,
  //   not_allowed_access: '접근이 허용되지 않은 이메일 도메인입니다. 접근을 원하시면 이메일로 문의해주세요.',
  // },
  // 다른 메시지도 커스터마이징 가능
  // formFieldLabel__emailAddress: '이메일 주소',
  // formFieldLabel__password: '비밀번호',
};



