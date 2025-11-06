package com.aura.aura_connect.user.presentation.dto;

import com.aura.aura_connect.user.domain.SocialType;

public record AuthenticatedUserResponse(Long id, String email, String name, String profileImageUrl, SocialType socialType) {
}
