package com.aura.aura_connect.user.presentation.dto;

import java.util.Objects;

/**
 * Authentication success payload returned to the frontend. The actual JWTs are delivered via
 * HttpOnly cookies, so this response focuses on the authenticated user and metadata about the
 * issued tokens.
 */
public record AuthResponse(AuthenticatedUserResponse user, TokenMetadata tokens) {

    public AuthResponse {
        Objects.requireNonNull(user, "user must not be null");
    }

    public static TokenMetadata bearer(long accessTokenExpiresIn, long refreshTokenExpiresIn) {
        return new TokenMetadata("Bearer", accessTokenExpiresIn, refreshTokenExpiresIn);
    }

    public record TokenMetadata(String tokenType, long accessTokenExpiresIn, long refreshTokenExpiresIn) {
    }
}

