package com.aura.aura_connect.user.application.dto;

import com.aura.aura_connect.security.jwt.AuthTokens;
import com.aura.aura_connect.user.presentation.dto.AuthResponse;

/**
 * Internal result returned by {@link com.aura.aura_connect.user.application.AuthService} that
 * includes both the public response body and raw tokens for cookie writing.
 */
public record AuthResult(AuthResponse response, AuthTokens tokens) {
}
