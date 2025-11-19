package com.aura.aura_connect.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.Assert;

/**
 * Application-wide settings that help the backend know how to redirect users back to the
 * frontend after OAuth2 logins or other flows.
 */
@ConfigurationProperties(prefix = "app")
public record AppProperties(String frontendBaseUrl) {

    public AppProperties {
        Assert.hasText(frontendBaseUrl, "Frontend base URL must not be empty");
    }
}
