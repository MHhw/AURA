package com.aura.backend.domain.auth.controller;

import com.aura.backend.domain.auth.dto.AuthResponse;
import com.aura.backend.domain.auth.dto.RegisterRequest;
import com.aura.backend.domain.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/login")
    public ResponseEntity<AuthResponse> loginTest(){
        System.out.println("hi");
        AuthResponse response = new AuthResponse();
        response.setMessage("connect success!!!");
        response.setName("admin");
        return ResponseEntity.ok(response);

    }

    @PostMapping("/login")
    public void login(){
        System.out.println("hi");
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request){

        System.out.println(request.getEmail());
        System.out.println(request.getName());
        System.out.println(request.getPassword());

        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }
}
