package com.aura.aura_connect.security.oauth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.Assert;

@ConfigurationProperties(prefix = "oauth2.cookie")
public record OAuth2CookieProperties(String authorizationRequestCookieName) {

    public OAuth2CookieProperties {
        Assert.hasText(
                authorizationRequestCookieName,
                "Authorization request cookie name must not be empty");
    }
}
