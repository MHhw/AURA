package com.aura.aura_connect.user.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class UserDomainTest {

    // 이메일이 같은 경우와 완전 신규 소셜 사용자 두 케이스를 테스트한다.
    @Test
    void link_existing_user_and_create_new_social_user() {
        User existing = User.createLocalUser("same@example.com", "Aura Local", "encoded-password");

        existing.updateSocialAccount(SocialType.KAKAO, "kakao-1234", "https://cdn.example.com/kakao.png");

        assertThat(existing.getSocialType()).isEqualTo(SocialType.KAKAO);
        assertThat(existing.getProviderId()).isEqualTo("kakao-1234");
        assertThat(existing.getProfileImageUrl()).isEqualTo("https://cdn.example.com/kakao.png");
        assertThat(existing.isLocalAccount()).isFalse();

        User newSocial = User.createSocialUser(
                "new@example.com",
                "New Social",
                "google-5678",
                "https://cdn.example.com/google.png",
                SocialType.GOOGLE
        );

        assertThat(newSocial.getEmail()).isEqualTo("new@example.com");
        assertThat(newSocial.getName()).isEqualTo("New Social");
        assertThat(newSocial.getSocialType()).isEqualTo(SocialType.GOOGLE);
        assertThat(newSocial.getProviderId()).isEqualTo("google-5678");
        assertThat(newSocial.getProfileImageUrl()).isEqualTo("https://cdn.example.com/google.png");
        assertThat(newSocial.isLocalAccount()).isFalse();
    }
}
