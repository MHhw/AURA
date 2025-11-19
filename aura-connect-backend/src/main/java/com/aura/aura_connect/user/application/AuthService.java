package com.aura.aura_connect.user.application;

import com.aura.aura_connect.security.jwt.AuthTokenService;
import com.aura.aura_connect.security.jwt.AuthTokens;
import com.aura.aura_connect.user.domain.User;
import com.aura.aura_connect.user.domain.UserPrincipal;
import com.aura.aura_connect.user.domain.repository.UserRepository;
import com.aura.aura_connect.user.application.dto.AuthResult;
import com.aura.aura_connect.user.presentation.dto.AuthResponse;
import com.aura.aura_connect.user.presentation.dto.AuthenticatedUserResponse;
import com.aura.aura_connect.user.presentation.dto.SignInRequest;
import com.aura.aura_connect.user.presentation.dto.SignUpRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthTokenService authTokenService;

    @Transactional
    public AuthResult register(SignUpRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered.");
        });

        User user = User.createLocalUser(
                request.email(),
                request.name(),
                passwordEncoder.encode(request.password()));

        userRepository.save(user);
        return buildAuthResult(user);
    }

    public AuthResult login(SignInRequest request) {
        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials."));

        if (!user.isLocalAccount()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This account must use social login.");
        }

        if (user.getPassword() == null || !passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials.");
        }

        return buildAuthResult(user);
    }

    public void logout(Long userId) {
        authTokenService.revokeTokens(userId);
    }

    private AuthResult buildAuthResult(User user) {
        UserPrincipal principal = UserPrincipal.from(user);
        AuthTokens tokens = authTokenService.issueTokens(principal);

        AuthenticatedUserResponse userResponse = new AuthenticatedUserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getProfileImageUrl(),
                user.getSocialType());

        AuthResponse.TokenMetadata tokenMetadata = AuthResponse.bearer(
                authTokenService.accessTokenTtlSeconds(), authTokenService.refreshTokenTtlSeconds());

        AuthResponse response = new AuthResponse(userResponse, tokenMetadata);
        return new AuthResult(response, tokens);
    }
}

