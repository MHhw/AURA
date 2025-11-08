package com.aura.aura_connect.user.presentation.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignInRequest(
        @NotBlank @Email(message = "Email format is invalid.") String email,
        @NotBlank @Size(min = 8, max = 64, message = "Password must be between 8 and 64 characters.") String password) {
}

