package com.aura.backend.global.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice // 모든 컨트롤러에서 발생하는 에러를 관장함
public class GlobalExceptionHandler {

    // RuntimeException이 발생하면 이 메서드가 실행됨
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e){
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }

}
