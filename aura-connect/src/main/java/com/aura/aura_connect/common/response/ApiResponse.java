package com.aura.aura_connect.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(String code, String message, T data) {

    private static final String DEFAULT_SUCCESS_CODE = "SUCCESS";
    private static final String DEFAULT_SUCCESS_MESSAGE = "Success";

    public static <T> ApiResponse<T> success(T data) {
        return success(DEFAULT_SUCCESS_MESSAGE, data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(DEFAULT_SUCCESS_CODE, message, data);
    }

    public static <T> ApiResponse<T> success(String code, String message, T data) {
        return new ApiResponse<>(code, message, data);
    }

    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(code, message, null);
    }
}
