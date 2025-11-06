package com.aura.aura_connect.user.presentation;

import com.aura.aura_connect.common.response.ApiResponse;
import com.aura.aura_connect.user.domain.UserPrincipal;
import com.aura.aura_connect.user.presentation.dto.AuthenticatedUserResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

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
}
