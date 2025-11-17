package com.aura.aura_connect.security.oauth;

import com.aura.aura_connect.user.application.UserService;
import com.aura.aura_connect.user.domain.User;
import com.aura.aura_connect.user.domain.exception.AccountLinkingRequiredException;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserService userService;

    public CustomOAuth2UserService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserProfile profile = OAuth2UserProfile.from(registrationId, oAuth2User.getAttributes());

        try {
            findOrCreateUser(profile);
        } catch (AccountLinkingRequiredException ex) {
            OAuth2Error error = new OAuth2Error(ex.getErrorCode().getCode(), ex.getMessage(), null);
            throw new OAuth2AuthenticationException(error, ex.getMessage());
        }

        Map<String, Object> enrichedAttributes = new LinkedHashMap<>(oAuth2User.getAttributes());
        enrichedAttributes.put("provider", profile.socialType().name());
        enrichedAttributes.put("providerId", profile.providerId());
        String nameAttributeKey = resolveNameAttributeKey(userRequest);
        enrichedAttributes.putIfAbsent(nameAttributeKey, profile.providerId());

        Collection<? extends GrantedAuthority> authorities = oAuth2User.getAuthorities();
        if (authorities == null || authorities.isEmpty()) {
            authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
        }

        return new DefaultOAuth2User(authorities, enrichedAttributes, nameAttributeKey);
    }

    private String resolveNameAttributeKey(OAuth2UserRequest userRequest) {
        String nameAttributeKey = userRequest.getClientRegistration()
                .getProviderDetails()
                .getUserInfoEndpoint()
                .getUserNameAttributeName();
        if (nameAttributeKey == null || nameAttributeKey.isBlank()) {
            return "providerId";
        }
        return nameAttributeKey;
    }

    private User findOrCreateUser(OAuth2UserProfile profile) {
        return userService.findOrCreateSocialUser(profile);
    }
}
