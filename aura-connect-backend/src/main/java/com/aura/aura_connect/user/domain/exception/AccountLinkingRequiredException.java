package com.aura.aura_connect.user.domain.exception;

public class AccountLinkingRequiredException extends RuntimeException {

    private final UserErrorCode errorCode;
    private final String email;

    public AccountLinkingRequiredException(String email) {
        super(UserErrorCode.ACCOUNT_LINK_REQUIRED.getMessage());
        this.errorCode = UserErrorCode.ACCOUNT_LINK_REQUIRED;
        this.email = email;
    }

    public UserErrorCode getErrorCode() {
        return errorCode;
    }

    public String getEmail() {
        return email;
    }
}
