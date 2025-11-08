package com.aura.aura_connect.user.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.aura.aura_connect.user.domain.User;
import com.aura.aura_connect.user.domain.repository.UserRepository;
import com.aura.aura_connect.user.presentation.dto.AuthResponse;
import com.aura.aura_connect.user.presentation.dto.SignInRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void login_withValidCredentials_returnsJwtAndUserPayload() {
        // given
        String email = "login-test@example.com";
        String rawPassword = "Password!234";
        User persisted = userRepository.save(
                User.createLocalUser(email, "Test User", passwordEncoder.encode(rawPassword)));

        // when
        AuthResponse response = authService.login(new SignInRequest(email, rawPassword));

        // then
        assertNotNull(response);
        assertFalse(response.accessToken().isBlank(), "JWT access token should not be blank");
        assertNotNull(response.user());
        assertEquals(persisted.getId(), response.user().id());
        assertEquals(email, response.user().email());
    }
}
