package com.aura.aura_connect.config;

import java.time.Duration;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(CorsProperties.class)
public class CorsConfig implements WebMvcConfigurer {

    private static final List<String> ALLOWED_METHODS =
            List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");
    private static final List<String> ALLOWED_HEADERS =
            List.of("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With", "Cookie");

    private final CorsProperties corsProperties;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(corsProperties.getAllowedOrigins().toArray(String[]::new))
                .allowedMethods(ALLOWED_METHODS.toArray(String[]::new))
                .allowedHeaders(ALLOWED_HEADERS.toArray(String[]::new))
                .exposedHeaders("Authorization")
                .allowCredentials(corsProperties.isAllowCredentials())
                .maxAge(Duration.ofHours(1).getSeconds());
    }

    @Bean
    @Primary
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(corsProperties.getAllowedOrigins());
        configuration.setAllowedMethods(ALLOWED_METHODS);
        configuration.setAllowedHeaders(ALLOWED_HEADERS);
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(corsProperties.isAllowCredentials());
        configuration.setMaxAge(Duration.ofHours(1).getSeconds());

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
