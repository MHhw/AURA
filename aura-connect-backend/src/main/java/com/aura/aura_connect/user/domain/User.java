package com.aura.aura_connect.user.domain;

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

    protected User() {
        // for JPA
    }

    public User(String email, String name, String profileImageUrl, SocialType socialType) {
        this(email, name, null, profileImageUrl, socialType);
    }

    public User(String email, String name, String encodedPassword, String profileImageUrl, SocialType socialType) {
        this.email = email;
        this.name = name;
        this.password = encodedPassword;
        this.profileImageUrl = profileImageUrl;
        this.socialType = socialType;
    }

    public static User createLocalUser(String email, String name, String encodedPassword) {
        return new User(email, name, encodedPassword, null, SocialType.LOCAL);
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

    public boolean isLocalAccount() {
        return socialType == null || socialType == SocialType.LOCAL;
    }

    public void updatePassword(String encodedPassword) {
        this.password = encodedPassword;
    }
}
