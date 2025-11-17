package com.aura.aura_connect.security.oauth;

import com.aura.aura_connect.security.config.CookieSecurityProperties;
import com.aura.aura_connect.security.oauth.config.OAuth2CookieProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Base64;
import java.util.Optional;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.SerializationUtils;
import org.springframework.util.StringUtils;

@Component
public class HttpCookieOAuth2AuthorizationRequestRepository
        implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {

    private static final int COOKIE_EXPIRE_SECONDS = 180;
    private static final String SAME_SITE_ATTRIBUTE = "SameSite";

    private final CookieSecurityProperties cookieSecurityProperties;
    private final OAuth2CookieProperties oAuth2CookieProperties;

    public HttpCookieOAuth2AuthorizationRequestRepository(
            CookieSecurityProperties cookieSecurityProperties,
            OAuth2CookieProperties oAuth2CookieProperties) {
        this.cookieSecurityProperties = cookieSecurityProperties;
        this.oAuth2CookieProperties = oAuth2CookieProperties;
    }

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        return getCookie(request)
                .map(cookie -> deserialize(cookie.getValue()))
                .orElse(null);
    }

    @Override
    public void saveAuthorizationRequest(
            OAuth2AuthorizationRequest authorizationRequest,
            HttpServletRequest request,
            HttpServletResponse response) {
        if (authorizationRequest == null) {
            removeAuthorizationRequestCookies(request, response);
            return;
        }

        String cookieValue = serialize(authorizationRequest);
        Cookie cookie = new Cookie(oAuth2CookieProperties.authorizationRequestCookieName(), cookieValue);
        cookie.setMaxAge(COOKIE_EXPIRE_SECONDS);
        configureCookieSecurity(cookie);
        response.addCookie(cookie);
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(
            HttpServletRequest request, HttpServletResponse response) {
        OAuth2AuthorizationRequest authorizationRequest = loadAuthorizationRequest(request);
        removeAuthorizationRequestCookies(request, response);
        return authorizationRequest;
    }

    private Optional<Cookie> getCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return Optional.empty();
        }

        for (Cookie cookie : cookies) {
            if (oAuth2CookieProperties.authorizationRequestCookieName().equals(cookie.getName())) {
                return Optional.of(cookie);
            }
        }
        return Optional.empty();
    }

    private void removeAuthorizationRequestCookies(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return;
        }

        for (Cookie cookie : cookies) {
            if (oAuth2CookieProperties.authorizationRequestCookieName().equals(cookie.getName())) {
                Cookie deleteCookie = new Cookie(cookie.getName(), null);
                deleteCookie.setMaxAge(0);
                configureCookieSecurity(deleteCookie);
                response.addCookie(deleteCookie);
            }
        }
    }

    private void configureCookieSecurity(Cookie cookie) {
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecurityProperties.secure());
        // Secure cookies are transmitted only via HTTPS connections; browsers drop them on HTTP.
        cookie.setPath(cookieSecurityProperties.path());
        if (StringUtils.hasText(cookieSecurityProperties.domain())) {
            cookie.setDomain(cookieSecurityProperties.domain());
        }
        cookie.setAttribute(SAME_SITE_ATTRIBUTE, cookieSecurityProperties.sameSite().attributeValue());
    }

    private String serialize(OAuth2AuthorizationRequest authorizationRequest) {
        byte[] serialized = SerializationUtils.serialize(authorizationRequest);
        return Base64.getUrlEncoder().encodeToString(serialized);
    }

    private OAuth2AuthorizationRequest deserialize(String value) {
        byte[] bytes = Base64.getUrlDecoder().decode(value);
        return (OAuth2AuthorizationRequest) SerializationUtils.deserialize(bytes);
    }
}
