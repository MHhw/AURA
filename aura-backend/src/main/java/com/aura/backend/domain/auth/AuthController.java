package com.aura.backend.domain.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    @GetMapping("/login")
    public ResponseEntity<AuthResponse> loginTest(){
        System.out.println("hi");
        AuthResponse response = new AuthResponse();
        response.setMessage("connect success!!!");
        response.setDisplayName("admin");
        return ResponseEntity.ok(response);

    }

    @PostMapping("/login")
    public void login(){
        System.out.println("hi");
    }
}
