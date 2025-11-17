package com.aura.aura_connect.security.oauth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.aura.aura_connect.security.config.CookieSecurityProperties;
import com.aura.aura_connect.security.jwt.CookieUtils;
import com.aura.aura_connect.security.jwt.RefreshTokenStore;
import com.aura.aura_connect.security.jwt.TokenProvider;
import com.aura.aura_connect.security.jwt.config.JwtProperties;
import com.aura.aura_connect.user.domain.SocialType;
import com.aura.aura_connect.user.domain.UserPrincipal;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.ArgumentCaptor;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

@ExtendWith(MockitoExtension.class)
class OAuth2AuthenticationSuccessHandlerTest {

    @Mock
    private TokenProvider tokenProvider;

    @Mock
    private RefreshTokenStore refreshTokenStore;

    private OAuth2AuthenticationSuccessHandler successHandler;
    private JwtProperties jwtProperties;
    private CookieUtils cookieUtils;

    @BeforeEach
    void setUp() {
        jwtProperties = new JwtProperties(
                "this-is-a-long-enough-test-secret-key-value",
                3600,
                1209600,
                "ACCESS_TOKEN",
                "REFRESH_TOKEN");
        CookieSecurityProperties cookieSecurityProperties =
                new CookieSecurityProperties("example.com", "/", CookieSecurityProperties.SameSitePolicy.LAX, true);
        cookieUtils = new CookieUtils(cookieSecurityProperties);
        successHandler =
                new OAuth2AuthenticationSuccessHandler(tokenProvider, refreshTokenStore, jwtProperties, cookieUtils);
    }

    @Test
    void onAuthenticationSuccess_setsHttpOnlyCookiesAndRedirects() throws ServletException, IOException {
        UserPrincipal principal = UserPrincipal.builder()
                .id(42L)
                .email("jane.doe@example.com")
                .name("Jane Doe")
                .profileImageUrl("https://example.com/avatar.jpg")
                .socialType(SocialType.GOOGLE)
                .build();
        Authentication authentication =
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(tokenProvider.generateAccessToken(principal)).thenReturn("mock-access-token");
        when(tokenProvider.generateRefreshToken(principal.getId())).thenReturn("mock-refresh-token");

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        successHandler.onAuthenticationSuccess(request, response, authentication);

        verify(tokenProvider).generateAccessToken(principal);
        verify(tokenProvider).generateRefreshToken(principal.getId());

        ArgumentCaptor<Duration> durationCaptor = ArgumentCaptor.forClass(Duration.class);
        verify(refreshTokenStore).save(eq(principal.getId()), eq("mock-refresh-token"), durationCaptor.capture());
        assertThat(durationCaptor.getValue()).isEqualTo(Duration.ofSeconds(jwtProperties.refreshTokenValiditySeconds()));

        List<String> cookieHeaders = response.getHeaders(HttpHeaders.SET_COOKIE);
        assertThat(cookieHeaders).hasSize(2);
        assertThat(cookieHeaders)
                .anySatisfy(header -> assertThat(header).contains("ACCESS_TOKEN=mock-access-token"))
                .anySatisfy(header -> assertThat(header).contains("REFRESH_TOKEN=mock-refresh-token"))
                .allSatisfy(header -> {
                    assertThat(header).contains("HttpOnly");
                    assertThat(header).contains("Secure");
                    assertThat(header).contains("SameSite=Lax");
                    assertThat(header).contains("Domain=example.com");
                });

        assertThat(response.getRedirectedUrl()).isEqualTo("/oauth/success");
        assertThat(response.getStatus()).isEqualTo(HttpServletResponse.SC_FOUND);
    }
}
