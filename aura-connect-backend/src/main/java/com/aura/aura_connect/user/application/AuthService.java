package com.aura.aura_connect.user.application;

import com.aura.aura_connect.security.jwt.TokenProvider;
import com.aura.aura_connect.user.domain.User;
import com.aura.aura_connect.user.domain.UserPrincipal;
import com.aura.aura_connect.user.domain.repository.UserRepository;
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
    private final TokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(SignUpRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered.");
        });

        User user = User.createLocalUser(
                request.email(),
                request.name(),
                passwordEncoder.encode(request.password()));

        userRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthResponse login(SignInRequest request) {
        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials."));

        if (!user.isLocalAccount()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This account must use social login.");
        }

        if (user.getPassword() == null || !passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials.");
        }

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        UserPrincipal principal = UserPrincipal.from(user);
        String token = tokenProvider.generateAccessToken(principal);

        AuthenticatedUserResponse userResponse = new AuthenticatedUserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getProfileImageUrl(),
                user.getSocialType());

        return new AuthResponse(token, userResponse);
    }
}

