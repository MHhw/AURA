package com.aura.aura_connect.security.oauth;

import com.aura.aura_connect.config.AppProperties;
import com.aura.aura_connect.security.jwt.AuthCookieManager;
import com.aura.aura_connect.security.jwt.AuthTokenService;
import com.aura.aura_connect.security.jwt.AuthTokens;
import com.aura.aura_connect.user.domain.SocialType;
import com.aura.aura_connect.user.domain.UserPrincipal;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final AuthTokenService authTokenService;
    private final AuthCookieManager authCookieManager;
    private final AppProperties appProperties;

    public OAuth2AuthenticationSuccessHandler(
            AuthTokenService authTokenService, AuthCookieManager authCookieManager, AppProperties appProperties) {
        this.authTokenService = authTokenService;
        this.authCookieManager = authCookieManager;
        this.appProperties = appProperties;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        UserPrincipal principal = resolvePrincipal(authentication);
        AuthTokens tokens = authTokenService.issueTokens(principal);
        authCookieManager.write(response, tokens);

        String redirectTarget = UriComponentsBuilder.fromUriString(appProperties.frontendBaseUrl())
                .path("/oauth/success")
                .build()
                .toUriString();

        response.sendRedirect(redirectTarget);
    }

    private UserPrincipal resolvePrincipal(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserPrincipal userPrincipal) {
            return userPrincipal;
        }

        if (principal instanceof UserDetails userDetails && userDetails instanceof UserPrincipal userPrincipal) {
            return userPrincipal;
        }

        if (principal instanceof OAuth2User oAuth2User) {
            return buildUserPrincipalFromAttributes(authentication, oAuth2User);
        }

        throw new IllegalArgumentException("Unsupported principal type: " + principal.getClass());
    }

    private UserPrincipal buildUserPrincipalFromAttributes(
            Authentication authentication, OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();

        Long id = extractId(attributes, authentication.getName());
        String email = asString(attributes.get("email"));
        String name = asString(attributes.getOrDefault("name", ""));
        String profileImageUrl = extractProfileImageUrl(attributes);
        SocialType socialType = extractSocialType(attributes);

        return UserPrincipal.builder()
                .id(id)
                .email(email)
                .name(name)
                .profileImageUrl(profileImageUrl)
                .socialType(socialType)
                .build();
    }

    private Long extractId(Map<String, Object> attributes, String fallback) {
        Object idCandidate = attributes.get("id");
        if (idCandidate == null) {
            idCandidate = attributes.get("providerId");
        }
        if (idCandidate == null) {
            idCandidate = attributes.get("sub");
        }
        if (idCandidate == null) {
            idCandidate = fallback;
        }

        if (idCandidate instanceof Number number) {
            return number.longValue();
        }

        String idAsString = asString(idCandidate);
        if (!StringUtils.hasText(idAsString)) {
            return null;
        }

        try {
            return Long.parseLong(idAsString);
        } catch (NumberFormatException ignored) {
            return null;
        }
    }

    private String extractProfileImageUrl(Map<String, Object> attributes) {
        String profileImageUrl = asString(attributes.get("profileImageUrl"));
        if (StringUtils.hasText(profileImageUrl)) {
            return profileImageUrl;
        }
        profileImageUrl = asString(attributes.get("picture"));
        if (StringUtils.hasText(profileImageUrl)) {
            return profileImageUrl;
        }
        profileImageUrl = asString(attributes.get("profile_image"));
        if (StringUtils.hasText(profileImageUrl)) {
            return profileImageUrl;
        }
        return null;
    }

    private SocialType extractSocialType(Map<String, Object> attributes) {
        Object value = attributes.get("socialType");
        if (value == null) {
            value = attributes.get("provider");
        }
        if (value == null) {
            return SocialType.UNKNOWN;
        }

        String socialTypeValue = value.toString();
        if (!StringUtils.hasText(socialTypeValue)) {
            return SocialType.UNKNOWN;
        }

        try {
            return SocialType.valueOf(socialTypeValue.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return SocialType.UNKNOWN;
        }
    }

    private String asString(Object value) {
        if (value == null) {
            return null;
        }
        return value.toString();
    }
}
