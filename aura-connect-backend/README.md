# AURA Connect Backend

Spring Boot 3 기반의 AURA O2O 헤어 플랫폼 백엔드입니다.

## 기능 분석 및 엔드포인트
1. **공용 메인 대시보드 응답**
   - `/`와 `/api/v1/main`에서 정적 메트릭/하이라이트 JSON을 내려 주는 컨트롤러가 구현되어 있으며, 로그인 없이 서비스 상태를 노출할 수 있습니다. (`MainController`)
   - **진행도:** 컨트롤러 레이어까지 완성(정적 데이터).
   - **엔드포인트:** `GET /`, `GET /api/v1/main`

2. **로컬 계정 회원가입**
   - 사용자가 이메일/이름/비밀번호로 회원가입하면 중복 이메일을 차단하고 암호를 암호화해 저장한 뒤 JWT 기반 인증 토큰을 즉시 발급합니다. (`AuthController.register`, `AuthService.register`)
   - **진행도:** 서비스 & 영속 계층까지 구현 완료.
   - **엔드포인트:** `POST /api/v1/auth/register`

3. **로컬 로그인 및 JWT 발급**
   - 기존 로컬 계정이 이메일/비밀번호로 로그인하면 `TokenProvider`가 액세스 토큰을 발급하고, `AuthController.login`이 인증 사용자 정보를 함께 반환합니다.
   - **진행도:** 구현 완료(비밀번호 검증 및 예외 처리 포함).
   - **엔드포인트:** `POST /api/v1/auth/login`

4. **인증 사용자 프로필 조회**
   - Spring Security 컨텍스트에 있는 `UserPrincipal`을 기반으로 현재 로그인한 사용자의 ID/이메일/이름/프로필 이미지를 조회합니다. 미인증 시 401을 반환합니다. (`AuthController.me`, `SecurityConfig`)
   - **진행도:** 구현 완료, JWT 또는 OAuth2 세션이 있으면 바로 사용 가능.
   - **엔드포인트:** `GET /api/v1/auth/me` (인증 필요)

5. **소셜 로그인 & 자동 사용자 프로비저닝**
   - OAuth 2.0 로그인 시 `CustomOAuth2UserService`가 공급자 프로필을 표준화해 저장/갱신하고, `OAuth2AuthenticationSuccessHandler`가 액세스/리프레시 토큰을 HTTP-only 쿠키로 내려줍니다. 공급자 불일치 시 계정 연동 예외를 발생시킵니다.
   - **진행도:** 서버 측 인증/토큰 발급까지 구현 완료. 계정 연동 확정/해제 API는 아직 없습니다.
   - **엔드포인트:** `GET /oauth2/authorization/{registrationId}` (로그인 시작), `GET /login/oauth2/code/*` (OAuth2 redirect, Spring 기본 엔드포인트)

6. **JWT 인증 필터 및 쿠키 토큰 처리**
   - `JwtAuthenticationFilter`가 Authorization 헤더나 HTTP-only 쿠키에서 토큰을 추출해 `SecurityContext`에 `UserPrincipal`을 주입하며, `TokenProvider`가 서명/검증을 담당합니다.
   - **진행도:** 전역 필터/토큰 유틸 완성, Refresh 토큰 저장(`RefreshTokenStore`) 포함.
   - **엔드포인트:** 전역 필터 기능이므로 별도 엔드포인트 없음.

7. **글로벌 CORS 설정**
   - `CorsConfig`가 허용 Origin/Headers/Methods를 프로퍼티 기반으로 구성하고, `SecurityConfig`에서 이를 적용해 SPA/모바일 클라이언트 요청을 허용합니다.
   - **진행도:** 설정 클래스 완료, 추가 Origin만 설정하면 즉시 사용 가능.
   - **엔드포인트:** CORS 전역 적용 기능으로 별도 엔드포인트 없음.
