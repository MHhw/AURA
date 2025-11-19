package com.aura.aura_connect.user.presentation;

import com.aura.aura_connect.common.response.ApiResponse;
import com.aura.aura_connect.security.jwt.AuthCookieManager;
import com.aura.aura_connect.user.application.AuthService;
import com.aura.aura_connect.user.application.dto.AuthResult;
import com.aura.aura_connect.user.domain.UserPrincipal;
import com.aura.aura_connect.user.presentation.dto.AuthResponse;
import com.aura.aura_connect.user.presentation.dto.AuthenticatedUserResponse;
import com.aura.aura_connect.user.presentation.dto.SignInRequest;
import com.aura.aura_connect.user.presentation.dto.SignUpRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthCookieManager authCookieManager;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AuthResponse> register(
            @Valid @RequestBody SignUpRequest request, HttpServletResponse response) {
        AuthResult result = authService.register(request);
        // Issue HttpOnly cookies immediately after signup so the SPA can simply reload.
        authCookieManager.write(response, result.tokens());
        return ApiResponse.success(result.response());
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(
            @Valid @RequestBody SignInRequest request, HttpServletResponse response) {
        AuthResult result = authService.login(request);
        // Keep the JSON payload minimal; the actual JWT values never touch JavaScript land.
        authCookieManager.write(response, result.tokens());
        return ApiResponse.success(result.response());
    }

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<AuthenticatedUserResponse> me(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        AuthenticatedUserResponse response = new AuthenticatedUserResponse(
                principal.getId(),
                principal.getEmail(),
                principal.getName(),
                principal.getProfileImageUrl(),
                principal.getSocialType());

        return ApiResponse.success(response);
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(
            @AuthenticationPrincipal UserPrincipal principal, HttpServletResponse response) {
        if (principal != null) {
            authService.logout(principal.getId());
        }
        authCookieManager.clear(response);
        return ApiResponse.success(null);
    }
}
