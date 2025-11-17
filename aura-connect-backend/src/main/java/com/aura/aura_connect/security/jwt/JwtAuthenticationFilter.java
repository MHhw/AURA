package com.aura.aura_connect.security.jwt;

import com.aura.aura_connect.security.jwt.config.JwtProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final TokenProvider tokenProvider;
    private final JwtProperties jwtProperties;
    private final CookieUtils cookieUtils;

    public JwtAuthenticationFilter(TokenProvider tokenProvider, JwtProperties jwtProperties, CookieUtils cookieUtils) {
        this.tokenProvider = tokenProvider;
        this.jwtProperties = jwtProperties;
        this.cookieUtils = cookieUtils;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = resolveToken(request);

        if (StringUtils.hasText(token)
                && tokenProvider.validateToken(token)
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            SecurityContextHolder.getContext().setAuthentication(tokenProvider.getAuthentication(token));
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(authorizationHeader) && authorizationHeader.startsWith(BEARER_PREFIX)) {
            return authorizationHeader.substring(BEARER_PREFIX.length());
        }

        return cookieUtils.getCookieValue(request, jwtProperties.accessTokenCookieName()).orElse(null);
    }
}
