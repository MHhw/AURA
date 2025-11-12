package com.aura.aura_connect.security.oauth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.aura.aura_connect.user.domain.SocialType;
import com.aura.aura_connect.user.domain.User;
import com.aura.aura_connect.user.domain.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2UserService;

class CustomOAuth2UserServiceTest {

    @Test
    void loadUser_googleProviderCreatesGoogleUser() {
        // 가짜 OAuth2UserRequest 를 만들어서 이 서비스를 호출하면 된다.
        UserRepository userRepository = mock(UserRepository.class);
        when(userRepository.findByEmail("google@example.com")).thenReturn(Optional.empty());

        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = request ->
                new DefaultOAuth2User(
                        List.of(new SimpleGrantedAuthority("ROLE_USER")),
                        Map.of(
                                "sub", "google-123",
                                "email", "google@example.com",
                                "name", "Google User"),
                        "sub");

        CustomOAuth2UserService service = new CustomOAuth2UserService(userRepository, delegate);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OAuth2UserRequest userRequest = createUserRequest("google", "sub");

        service.loadUser(userRequest);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getSocialType()).isEqualTo(SocialType.GOOGLE);
        assertThat(userCaptor.getValue().getEmail()).isEqualTo("google@example.com");
    }

    @Test
    void loadUser_kakaoProviderReusesExistingUser() {
        // 가짜 OAuth2UserRequest 를 만들어서 이 서비스를 호출하면 된다.
        User existingUser = new User("kakao@example.com", "Existing", null, SocialType.KAKAO);
        UserRepository userRepository = mock(UserRepository.class);
        when(userRepository.findByEmail("kakao@example.com")).thenReturn(Optional.of(existingUser));

        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = request ->
                new DefaultOAuth2User(
                        List.of(new SimpleGrantedAuthority("ROLE_USER")),
                        Map.of(
                                "id", 112233L,
                                "kakao_account",
                                        Map.of(
                                                "email", "kakao@example.com",
                                                "profile", Map.of("nickname", "Kakao User"))),
                        "id");

        CustomOAuth2UserService service = new CustomOAuth2UserService(userRepository, delegate);

        OAuth2UserRequest userRequest = createUserRequest("kakao", "id");

        service.loadUser(userRequest);

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void loadUser_naverProviderCreatesNaverUser() {
        // 가짜 OAuth2UserRequest 를 만들어서 이 서비스를 호출하면 된다.
        UserRepository userRepository = mock(UserRepository.class);
        when(userRepository.findByEmail("naver@example.com")).thenReturn(Optional.empty());

        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = request ->
                new DefaultOAuth2User(
                        List.of(new SimpleGrantedAuthority("ROLE_USER")),
                        Map.of(
                                "response",
                                        Map.of(
                                                "id", "naver-999",
                                                "email", "naver@example.com",
                                                "name", "Naver User")),
                        "id");

        CustomOAuth2UserService service = new CustomOAuth2UserService(userRepository, delegate);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OAuth2UserRequest userRequest = createUserRequest("naver", "id");

        service.loadUser(userRequest);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getSocialType()).isEqualTo(SocialType.NAVER);
        assertThat(userCaptor.getValue().getEmail()).isEqualTo("naver@example.com");
    }

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
