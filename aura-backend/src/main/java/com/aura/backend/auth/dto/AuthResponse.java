package com.aura.backend.auth.dto;

import com.aura.backend.security.UserPrincipal;
import com.aura.backend.user.AuthProvider;
import com.aura.backend.user.User;

public record AuthResponse(
        Long id,
        String email,
        String displayName,
        AuthProvider provider
) {
    public static AuthResponse from(User user) {
        return new AuthResponse(user.getId(), user.getEmail(), user.getDisplayName(), user.getProvider());
    }

    public static AuthResponse from(UserPrincipal principal) {
        return new AuthResponse(principal.getId(), principal.getEmail(), principal.getDisplayName(),
                AuthProvider.valueOf(principal.getProvider()));
    }
}
