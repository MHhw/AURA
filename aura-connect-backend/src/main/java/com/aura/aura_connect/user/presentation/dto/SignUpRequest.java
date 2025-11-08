package com.aura.aura_connect.user.presentation.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignUpRequest(
        @NotBlank @Email(message = "Email format is invalid.") String email,
        @NotBlank @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters.") String name,
        @NotBlank @Size(min = 8, max = 64, message = "Password must be between 8 and 64 characters.") String password) {
}

