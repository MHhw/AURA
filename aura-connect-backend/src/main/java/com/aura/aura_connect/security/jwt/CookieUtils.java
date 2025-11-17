package com.aura.aura_connect.security.jwt;

import com.aura.aura_connect.security.config.CookieSecurityProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class CookieUtils {

    private final CookieSecurityProperties cookieSecurityProperties;

    public CookieUtils(CookieSecurityProperties cookieSecurityProperties) {
        this.cookieSecurityProperties = cookieSecurityProperties;
    }

    public Optional<String> getCookieValue(HttpServletRequest request, String name) {
        if (request.getCookies() == null) {
            return Optional.empty();
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> cookie.getName().equals(name))
                .map(Cookie::getValue)
                .findFirst();
    }

    public void addHttpOnlyCookie(
            HttpServletResponse response, String name, String value, long maxAgeSeconds) {
        ResponseCookie cookie = buildBaseCookie(name, value, Duration.ofSeconds(maxAgeSeconds));

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void deleteCookie(HttpServletResponse response, String name) {
        ResponseCookie cookie = buildBaseCookie(name, "", Duration.ZERO);

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private ResponseCookie buildBaseCookie(String name, String value, Duration maxAge) {
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(cookieSecurityProperties.secure())
                .sameSite(cookieSecurityProperties.sameSite().attributeValue())
                .path(cookieSecurityProperties.path())
                .maxAge(maxAge);

        if (StringUtils.hasText(cookieSecurityProperties.domain())) {
            builder.domain(cookieSecurityProperties.domain());
        }

        // Secure cookies are transmitted only via HTTPS connections; browsers will drop them for HTTP.
        return builder.build();
    }
}
