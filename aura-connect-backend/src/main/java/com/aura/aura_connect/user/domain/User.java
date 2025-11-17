package com.aura.aura_connect.user.domain;

import com.aura.aura_connect.user.domain.type.AccountLinkStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(name = "password_hash")
    private String password;

    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SocialType socialType;

    @Column(name = "provider_id", length = 100)
    private String providerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_link_status", nullable = false, length = 20)
    private AccountLinkStatus accountLinkStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "link_candidate_provider", length = 30)
    private SocialType linkCandidateProvider;

    @Column(name = "link_candidate_provider_id", length = 100)
    private String linkCandidateProviderId;

    protected User() {
        // for JPA
    }

    public User(String email, String name, String profileImageUrl, SocialType socialType) {
        this(email, name, null, profileImageUrl, socialType, null);
    }

    public User(String email, String name, String encodedPassword, String profileImageUrl, SocialType socialType) {
        this(email, name, encodedPassword, profileImageUrl, socialType, null);
    }

    private User(
            String email,
            String name,
            String encodedPassword,
            String profileImageUrl,
            SocialType socialType,
            String providerId
    ) {
        this.email = email;
        this.name = name;
        this.password = encodedPassword;
        this.profileImageUrl = profileImageUrl;
        this.socialType = socialType;
        this.providerId = providerId;
        this.accountLinkStatus = AccountLinkStatus.NONE;
    }

    public static User createLocalUser(String email, String name, String encodedPassword) {
        return new User(email, name, encodedPassword, null, SocialType.LOCAL, null);
    }

    public static User createSocialUser(
            String email,
            String name,
            String providerId,
            String profileImageUrl,
            SocialType socialType
    ) {
        return new User(email, name, null, profileImageUrl, socialType, providerId);
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public SocialType getSocialType() {
        return socialType;
    }

    public String getProviderId() {
        return providerId;
    }

    public AccountLinkStatus getAccountLinkStatus() {
        return accountLinkStatus;
    }

    public SocialType getLinkCandidateProvider() {
        return linkCandidateProvider;
    }

    public String getLinkCandidateProviderId() {
        return linkCandidateProviderId;
    }

    public boolean isLocalAccount() {
        return socialType == null || socialType == SocialType.LOCAL;
    }

    public boolean hasSameProvider(SocialType socialType) {
        return this.socialType != null && this.socialType == socialType;
    }

    public boolean shouldUpdateProvider(String providerId) {
        return providerId != null && !providerId.equals(this.providerId);
    }

    public void updatePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    public void updateSocialAccount(SocialType socialType, String providerId, String profileImageUrl) {
        this.socialType = socialType;
        this.providerId = providerId;
        if (profileImageUrl != null) {
            this.profileImageUrl = profileImageUrl;
        }
        clearLinkRequirement();
    }

    public void markLinkRequired(SocialType candidateProvider, String candidateProviderId) {
        this.accountLinkStatus = AccountLinkStatus.LINK_REQUIRED;
        this.linkCandidateProvider = candidateProvider;
        this.linkCandidateProviderId = candidateProviderId;
    }

    public void clearLinkRequirement() {
        this.accountLinkStatus = AccountLinkStatus.NONE;
        this.linkCandidateProvider = null;
        this.linkCandidateProviderId = null;
    }
}
