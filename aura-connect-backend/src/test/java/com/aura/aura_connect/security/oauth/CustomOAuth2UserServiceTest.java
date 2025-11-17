package com.aura.aura_connect.security.oauth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.aura.aura_connect.user.application.UserService;
import com.aura.aura_connect.user.domain.SocialType;
import com.aura.aura_connect.user.domain.User;
import com.aura.aura_connect.user.domain.exception.AccountLinkingRequiredException;
import java.lang.reflect.Method;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.OAuth2AccessToken;

class CustomOAuth2UserServiceTest {

        @Test
        void loadUser_googleProviderCreatesGoogleUser() throws Exception {
                // given
                UserService userService = mock(UserService.class);
                User savedUser = User.createSocialUser(
                                "google@example.com",
                                "Google User",
                                "google-123",
                                null,
                                SocialType.GOOGLE);
                when(userService.findOrCreateSocialUser(any())).thenReturn(savedUser);

                CustomOAuth2UserService service = new CustomOAuth2UserService(userService);

                // 기존 delegate에서 쓰던 attributes 그대로 사용
                Map<String, Object> attributes = Map.of(
                                "sub", "google-123",
                                "email", "google@example.com",
                                "name", "Google User");

                // OAuth2UserProfile 생성
                OAuth2UserProfile profile = OAuth2UserProfile.from("google", attributes);

                // when: private findOrCreateUser 호출 (리플렉션)
                Method method = CustomOAuth2UserService.class
                                .getDeclaredMethod("findOrCreateUser", OAuth2UserProfile.class);
                method.setAccessible(true);
                Object result = method.invoke(service, profile);

                // then
                ArgumentCaptor<OAuth2UserProfile> profileCaptor = ArgumentCaptor.forClass(OAuth2UserProfile.class);
                verify(userService).findOrCreateSocialUser(profileCaptor.capture());
                OAuth2UserProfile capturedProfile = profileCaptor.getValue();
                assertThat(capturedProfile.socialType()).isEqualTo(SocialType.GOOGLE);
                assertThat(capturedProfile.email()).isEqualTo("google@example.com");
                assertThat(capturedProfile.providerId()).isEqualTo("google-123");
                assertThat(result).isSameAs(savedUser);
        }

        @Test
        void loadUser_kakaoProviderReusesExistingUser() throws Exception {
            // given
            UserService userService = mock(UserService.class);
            User existingUser = new User("kakao@example.com", "Existing", null, SocialType.KAKAO);
            when(userService.findOrCreateSocialUser(any())).thenReturn(existingUser);

                CustomOAuth2UserService service = new CustomOAuth2UserService(userService);

                Map<String, Object> attributes = Map.of(
                                "id", 112233L,
                                "kakao_account", Map.of(
                                                "email", "kakao@example.com",
                                                "profile", Map.of("nickname", "Kakao User")));

                OAuth2UserProfile profile = OAuth2UserProfile.from("kakao", attributes);

                // when
                Method method = CustomOAuth2UserService.class
                                .getDeclaredMethod("findOrCreateUser", OAuth2UserProfile.class);
                method.setAccessible(true);
                Object result = method.invoke(service, profile);

                // then: 카카오 프로필 매핑 검증
                ArgumentCaptor<OAuth2UserProfile> profileCaptor = ArgumentCaptor.forClass(OAuth2UserProfile.class);
                verify(userService).findOrCreateSocialUser(profileCaptor.capture());
                OAuth2UserProfile capturedProfile = profileCaptor.getValue();
                assertThat(capturedProfile.socialType()).isEqualTo(SocialType.KAKAO);
                assertThat(capturedProfile.email()).isEqualTo("kakao@example.com");
                assertThat(capturedProfile.providerId()).isEqualTo("112233");
                assertThat(capturedProfile.name()).isEqualTo("Kakao User");
                assertThat(result).isSameAs(existingUser);
        }

        @Test
        void loadUser_doesNotOverrideLocalAccount() throws Exception {
                // given
                UserService userService = mock(UserService.class);
                when(userService.findOrCreateSocialUser(any()))
                                .thenThrow(new AccountLinkingRequiredException("local@example.com"));

                CustomOAuth2UserService service = new CustomOAuth2UserService(userService);

                Map<String, Object> attributes = Map.of(
                                "sub", "google-321",
                                "email", "local@example.com",
                                "name", "Social User");

                OAuth2UserProfile profile = OAuth2UserProfile.from("google", attributes);

                Method method = CustomOAuth2UserService.class
                                .getDeclaredMethod("findOrCreateUser", OAuth2UserProfile.class);
                method.setAccessible(true);
                // then: 기존 LOCAL 계정은 링크 요구 예외를 그대로 전달
                assertThatThrownBy(() -> method.invoke(service, profile))
                                .hasCauseInstanceOf(AccountLinkingRequiredException.class);
        }

        @Test
        void loadUser_naverProviderCreatesNaverUser() throws Exception {
                // given
                UserService userService = mock(UserService.class);
                User savedUser = User.createSocialUser(
                                "naver@example.com",
                                "Naver User",
                                "naver-999",
                                null,
                                SocialType.NAVER);
                when(userService.findOrCreateSocialUser(any())).thenReturn(savedUser);

                CustomOAuth2UserService service = new CustomOAuth2UserService(userService);

                Map<String, Object> attributes = Map.of(
                                "response", Map.of(
                                                "id", "naver-999",
                                                "email", "naver@example.com",
                                                "name", "Naver User"));

                OAuth2UserProfile profile = OAuth2UserProfile.from("naver", attributes);

                // when
                Method method = CustomOAuth2UserService.class
                                .getDeclaredMethod("findOrCreateUser", OAuth2UserProfile.class);
                method.setAccessible(true);
                Object result = method.invoke(service, profile);

                // then
                ArgumentCaptor<OAuth2UserProfile> profileCaptor = ArgumentCaptor.forClass(OAuth2UserProfile.class);
                verify(userService).findOrCreateSocialUser(profileCaptor.capture());
                OAuth2UserProfile capturedProfile = profileCaptor.getValue();
                assertThat(capturedProfile.socialType()).isEqualTo(SocialType.NAVER);
                assertThat(capturedProfile.email()).isEqualTo("naver@example.com");
                assertThat(capturedProfile.providerId()).isEqualTo("naver-999");
                assertThat(result).isSameAs(savedUser);
        }

        // 이 메서드는 지금은 안 쓰지만, 혹시 나중에 loadUser를 직접 테스트할 때 참고용으로 놔둬도 됨
        @SuppressWarnings("unused")
        private OAuth2UserRequest createUserRequest(String registrationId, String userNameAttributeName) {
                ClientRegistration clientRegistration = ClientRegistration.withRegistrationId(registrationId)
                                .clientId("client-id")
                                .clientSecret("client-secret")
                                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                                .redirectUri("https://example.com/callback")
                                .scope("profile", "email")
                                .authorizationUri("https://example.com/oauth2/authorize")
                                .tokenUri("https://example.com/oauth2/token")
                                .userInfoUri("https://example.com/oauth2/userinfo")
                                .userNameAttributeName(userNameAttributeName)
                                .clientName(registrationId.toUpperCase())
                                .build();

                OAuth2AccessToken accessToken = new OAuth2AccessToken(
                                OAuth2AccessToken.TokenType.BEARER,
                                "token-value",
                                Instant.now(),
                                Instant.now().plusSeconds(3600));

                return new OAuth2UserRequest(clientRegistration, accessToken);
        }
}
