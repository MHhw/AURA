package com.aura.aura_connect;

import com.aura.aura_connect.security.config.CookieSecurityProperties;
import com.aura.aura_connect.security.jwt.config.JwtProperties;
import com.aura.aura_connect.security.oauth.config.OAuth2CookieProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({JwtProperties.class, CookieSecurityProperties.class, OAuth2CookieProperties.class})
public class AuraConnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuraConnectApplication.class, args);
    }
}
