package com.aura.aura_connect.security.jwt;

/**
 * Value object representing both access and refresh tokens issued during authentication.
 */
public record AuthTokens(String accessToken, String refreshToken) {
}
