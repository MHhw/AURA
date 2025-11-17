package com.aura.aura_connect.user.application;

import com.aura.aura_connect.security.oauth.OAuth2UserProfile;
import com.aura.aura_connect.user.domain.User;
import com.aura.aura_connect.user.domain.exception.AccountLinkingRequiredException;
import com.aura.aura_connect.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public User findOrCreateSocialUser(OAuth2UserProfile profile) {
        return userRepository
                .findByEmail(profile.email())
                .map(user -> handleExistingUser(user, profile))
                .orElseGet(() -> createSocialUser(profile));
    }

    private User createSocialUser(OAuth2UserProfile profile) {
        User newUser = User.createSocialUser(
                profile.email(),
                profile.name(),
                profile.providerId(),
                profile.profileImageUrl(),
                profile.socialType());
        return userRepository.save(newUser);
    }

    private User handleExistingUser(User user, OAuth2UserProfile profile) {
        if (user.isLocalAccount()) {
            user.markLinkRequired(profile.socialType(), profile.providerId());
            userRepository.save(user);
            throw new AccountLinkingRequiredException(user.getEmail());
        }

        if (!user.hasSameProvider(profile.socialType())) {
            user.markLinkRequired(profile.socialType(), profile.providerId());
            userRepository.save(user);
            throw new AccountLinkingRequiredException(user.getEmail());
        }

        if (user.shouldUpdateProvider(profile.providerId())
                || user.getProfileImageUrl() == null && profile.profileImageUrl() != null) {
            user.updateSocialAccount(profile.socialType(), profile.providerId(), profile.profileImageUrl());
            return userRepository.save(user);
        }

        return user;
    }
}
