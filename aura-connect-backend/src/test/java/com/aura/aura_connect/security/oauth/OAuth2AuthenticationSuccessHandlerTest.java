package com.aura.aura_connect.security.oauth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.aura.aura_connect.security.jwt.JwtTokenProvider;
import com.aura.aura_connect.user.domain.SocialType;
import com.aura.aura_connect.user.domain.UserPrincipal;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

@ExtendWith(MockitoExtension.class)
class OAuth2AuthenticationSuccessHandlerTest {

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    private ObjectMapper objectMapper;
    private OAuth2AuthenticationSuccessHandler successHandler;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        successHandler = new OAuth2AuthenticationSuccessHandler(jwtTokenProvider, objectMapper);
    }

    @Test
    void onAuthenticationSuccess_generatesTokenAndWritesJsonResponse() throws ServletException, IOException {
        // 실행 방법: 성공 핸들러를 직접 호출해서 response 를 검사하는 방식
        UserPrincipal principal = UserPrincipal.builder()
                .id(42L)
                .email("jane.doe@example.com")
                .name("Jane Doe")
                .profileImageUrl("https://example.com/avatar.jpg")
                .socialType(SocialType.GOOGLE)
                .build();
        Authentication authentication =
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(jwtTokenProvider.generateAccessToken(principal)).thenReturn("mock-access-token");

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        successHandler.onAuthenticationSuccess(request, response, authentication);

        verify(jwtTokenProvider).generateAccessToken(principal);

        assertThat(response.getStatus()).isEqualTo(HttpServletResponse.SC_OK);
        assertThat(response.getContentType()).isEqualTo(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> payload = objectMapper.readValue(
                response.getContentAsByteArray(), new TypeReference<Map<String, Object>>() {});
        assertThat(payload.get("accessToken")).isEqualTo("mock-access-token");

        @SuppressWarnings("unchecked")
        Map<String, Object> user = (Map<String, Object>) payload.get("user");
        assertThat(user).isNotNull();
        assertThat(user.get("id")).isEqualTo(42);
        assertThat(user.get("email")).isEqualTo("jane.doe@example.com");
        assertThat(user.get("socialType")).isEqualTo(SocialType.GOOGLE.name());
    }
}
