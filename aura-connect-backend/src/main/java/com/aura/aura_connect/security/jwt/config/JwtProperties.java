package com.aura.aura_connect.security.jwt.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.Assert;

@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(
        String secret,
        long accessTokenValiditySeconds,
        long refreshTokenValiditySeconds,
        String accessTokenCookieName,
        String refreshTokenCookieName) {

    public JwtProperties {
        Assert.hasText(secret, "JWT secret must not be empty");
        Assert.isTrue(accessTokenValiditySeconds > 0, "Access token validity must be positive");
        Assert.isTrue(refreshTokenValiditySeconds > 0, "Refresh token validity must be positive");
        Assert.hasText(accessTokenCookieName, "Access token cookie name must not be empty");
        Assert.hasText(refreshTokenCookieName, "Refresh token cookie name must not be empty");
    }
}
