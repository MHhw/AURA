package com.aura.aura_connect.security.jwt;

import com.aura.aura_connect.security.jwt.config.JwtProperties;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

/**
 * Writes and clears authentication cookies so that both REST logins and OAuth callbacks follow the
 * same HttpOnly + Secure cookie policy.
 */
@Component
public class AuthCookieManager {

    private final JwtProperties jwtProperties;
    private final CookieUtils cookieUtils;

    public AuthCookieManager(JwtProperties jwtProperties, CookieUtils cookieUtils) {
        this.jwtProperties = jwtProperties;
        this.cookieUtils = cookieUtils;
    }

    public void write(HttpServletResponse response, AuthTokens tokens) {
        cookieUtils.addHttpOnlyCookie(
                response,
                jwtProperties.accessTokenCookieName(),
                tokens.accessToken(),
                jwtProperties.accessTokenValiditySeconds());
        cookieUtils.addHttpOnlyCookie(
                response,
                jwtProperties.refreshTokenCookieName(),
                tokens.refreshToken(),
                jwtProperties.refreshTokenValiditySeconds());
    }

    public void clear(HttpServletResponse response) {
        cookieUtils.deleteCookie(response, jwtProperties.accessTokenCookieName());
        cookieUtils.deleteCookie(response, jwtProperties.refreshTokenCookieName());
    }
}
