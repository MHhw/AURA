package com.aura.aura_connect.security.oauth;

import com.aura.aura_connect.user.domain.SocialType;
import java.util.Map;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;

public record OAuth2UserProfile(
        String providerId,
        String email,
        String name,
        SocialType socialType) {

    public static OAuth2UserProfile from(String registrationId, Map<String, Object> attributes) {
        String normalizedId = registrationId.toLowerCase();
        return switch (normalizedId) {
            case "google" -> fromGoogle(attributes);
            case "kakao" -> fromKakao(attributes);
            case "naver" -> fromNaver(attributes);
            default -> throw new OAuth2AuthenticationException(
                    new OAuth2Error("unsupported_provider"),
                    "Unsupported OAuth2 provider: " + registrationId);
        };
    }

    private static OAuth2UserProfile fromGoogle(Map<String, Object> attributes) {
        String providerId = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        return new OAuth2UserProfile(providerId, email, name, SocialType.GOOGLE);
    }

    @SuppressWarnings("unchecked")
    private static OAuth2UserProfile fromKakao(Map<String, Object> attributes) {
        Object idValue = attributes.get("id");
        String providerId = idValue != null ? String.valueOf(idValue) : null;
        Map<String, Object> account = (Map<String, Object>) attributes.get("kakao_account");
        String email = account != null ? (String) account.get("email") : null;
        Map<String, Object> profile = account != null ? (Map<String, Object>) account.get("profile") : null;
        String name = profile != null ? (String) profile.get("nickname") : null;
        return new OAuth2UserProfile(providerId, email, name, SocialType.KAKAO);
    }

    @SuppressWarnings("unchecked")
    private static OAuth2UserProfile fromNaver(Map<String, Object> attributes) {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        if (response == null) {
            response = Map.of();
        }
        String providerId = (String) response.get("id");
        String email = (String) response.get("email");
        String name = (String) response.get("name");
        return new OAuth2UserProfile(providerId, email, name, SocialType.NAVER);
    }
}
