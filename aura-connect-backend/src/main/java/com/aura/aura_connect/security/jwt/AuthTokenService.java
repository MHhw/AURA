package com.aura.aura_connect.security.jwt;

import com.aura.aura_connect.security.jwt.config.JwtProperties;
import com.aura.aura_connect.user.domain.UserPrincipal;
import java.time.Duration;
import org.springframework.stereotype.Component;

/**
 * Issues, stores, and revokes JWTs. Centralizing the logic ensures local login and OAuth flows
 * behave consistently.
 */
@Component
public class AuthTokenService {

    private final TokenProvider tokenProvider;
    private final RefreshTokenStore refreshTokenStore;
    private final JwtProperties jwtProperties;

    public AuthTokenService(
            TokenProvider tokenProvider, RefreshTokenStore refreshTokenStore, JwtProperties jwtProperties) {
        this.tokenProvider = tokenProvider;
        this.refreshTokenStore = refreshTokenStore;
        this.jwtProperties = jwtProperties;
    }

    public AuthTokens issueTokens(UserPrincipal principal) {
        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshToken = tokenProvider.generateRefreshToken(principal.getId());

        refreshTokenStore.save(
                principal.getId(),
                refreshToken,
                Duration.ofSeconds(jwtProperties.refreshTokenValiditySeconds()));

        return new AuthTokens(accessToken, refreshToken);
    }

    public void revokeTokens(Long userId) {
        if (userId == null) {
            return;
        }
        refreshTokenStore.delete(userId);
    }

    public long accessTokenTtlSeconds() {
        return jwtProperties.accessTokenValiditySeconds();
    }

    public long refreshTokenTtlSeconds() {
        return jwtProperties.refreshTokenValiditySeconds();
    }
}
