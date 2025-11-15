package com.aura.aura_connect.security.oauth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.aura.aura_connect.user.domain.SocialType;
import com.aura.aura_connect.user.domain.User;
import com.aura.aura_connect.user.domain.repository.UserRepository;
import java.lang.reflect.Method;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
                UserRepository userRepository = mock(UserRepository.class);
                when(userRepository.findByEmail("google@example.com")).thenReturn(Optional.empty());
                when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

                CustomOAuth2UserService service = new CustomOAuth2UserService(userRepository);

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
                method.invoke(service, profile);

                // then
                ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
                verify(userRepository).save(userCaptor.capture());
                assertThat(userCaptor.getValue().getSocialType()).isEqualTo(SocialType.GOOGLE);
                assertThat(userCaptor.getValue().getEmail()).isEqualTo("google@example.com");
        }

        @Test
        void loadUser_kakaoProviderReusesExistingUser() throws Exception {
                // given
                User existingUser = new User("kakao@example.com", "Existing", null, SocialType.KAKAO);
                UserRepository userRepository = mock(UserRepository.class);
                when(userRepository.findByEmail("kakao@example.com")).thenReturn(Optional.of(existingUser));

                CustomOAuth2UserService service = new CustomOAuth2UserService(userRepository);

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
                method.invoke(service, profile);

                // then: 기존 유저 재사용이므로 save 호출 X
                verify(userRepository, never()).save(any(User.class));
        }

        @Test
        void loadUser_naverProviderCreatesNaverUser() throws Exception {
                // given
                UserRepository userRepository = mock(UserRepository.class);
                when(userRepository.findByEmail("naver@example.com")).thenReturn(Optional.empty());
                when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

                CustomOAuth2UserService service = new CustomOAuth2UserService(userRepository);

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
                method.invoke(service, profile);

                // then
                ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
                verify(userRepository).save(userCaptor.capture());
                assertThat(userCaptor.getValue().getSocialType()).isEqualTo(SocialType.NAVER);
                assertThat(userCaptor.getValue().getEmail()).isEqualTo("naver@example.com");
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
