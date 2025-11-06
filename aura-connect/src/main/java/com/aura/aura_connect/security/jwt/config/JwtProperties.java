package com.aura.aura_connect.security.jwt.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.Assert;

@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(String secret, long accessTokenValiditySeconds) {

    public JwtProperties {
        Assert.hasText(secret, "JWT secret must not be empty");
        Assert.isTrue(accessTokenValiditySeconds > 0, "Token validity must be positive");
    }
}
