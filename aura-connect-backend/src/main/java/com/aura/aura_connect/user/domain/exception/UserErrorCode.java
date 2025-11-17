package com.aura.aura_connect.user.domain.exception;

import org.springframework.http.HttpStatus;

public enum UserErrorCode {
    ACCOUNT_LINK_REQUIRED(HttpStatus.CONFLICT, "U001", "Account link is required for this email."),
    SOCIAL_PROVIDER_CONFLICT(HttpStatus.CONFLICT, "U002", "Different social provider detected for the same email.");

    private final HttpStatus status;
    private final String code;
    private final String message;

    UserErrorCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
