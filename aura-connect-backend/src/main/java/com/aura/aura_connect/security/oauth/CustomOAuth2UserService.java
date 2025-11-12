package com.aura.aura_connect.security.oauth;

import com.aura.aura_connect.user.domain.User;
import com.aura.aura_connect.user.domain.repository.UserRepository;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2UserService;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this(userRepository, new DefaultOAuth2UserService());
    }

    CustomOAuth2UserService(
            UserRepository userRepository, OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate) {
        this.userRepository = userRepository;
        this.delegate = delegate;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = delegate.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserProfile profile = OAuth2UserProfile.from(registrationId, oAuth2User.getAttributes());

        findOrCreateUser(profile);

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
        Optional<User> existingUser = userRepository.findByEmail(profile.email());
        return existingUser
                .map(user -> updateSocialUser(user, profile))
                .orElseGet(() -> userRepository.save(createSocialUser(profile)));
    }

    private User createSocialUser(OAuth2UserProfile profile) {
        return User.createSocialUser(
                profile.email(),
                profile.name(),
                profile.providerId(),
                null,
                profile.socialType());
    }

    private User updateSocialUser(User user, OAuth2UserProfile profile) {
        if (!profile.socialType().equals(user.getSocialType())) {
            user.updateSocialAccount(profile.socialType(), profile.providerId(), null);
            return userRepository.save(user);
        }
        if (user.getProviderId() == null && profile.providerId() != null) {
            user.updateSocialAccount(profile.socialType(), profile.providerId(), null);
            return userRepository.save(user);
        }
        return user;
    }
}
