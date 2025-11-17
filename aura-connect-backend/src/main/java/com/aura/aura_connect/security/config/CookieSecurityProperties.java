package com.aura.aura_connect.security.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.StringUtils;

@ConfigurationProperties(prefix = "security.cookie")
public record CookieSecurityProperties(
        String domain, String path, SameSitePolicy sameSite, boolean secure) {

    public CookieSecurityProperties {
        path = StringUtils.hasText(path) ? path : "/";
        sameSite = sameSite == null ? SameSitePolicy.LAX : sameSite;
    }

    public enum SameSitePolicy {
        LAX("Lax"),
        STRICT("Strict");

        private final String attributeValue;

        SameSitePolicy(String attributeValue) {
            this.attributeValue = attributeValue;
        }

        public String attributeValue() {
            return attributeValue;
        }
    }
}
