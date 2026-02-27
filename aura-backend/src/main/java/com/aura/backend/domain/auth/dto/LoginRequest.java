package com.aura.backend.domain.auth.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {
    private String message;
    private String token;
    private String email;
    private String name;
}
