package com.aura.backend.auth;

import com.aura.backend.auth.dto.LoginRequest;
import com.aura.backend.auth.dto.RegisterRequest;
import com.aura.backend.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void clean() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("회원가입 후 로그인까지 정상 플로우가 동작한다")
    void registerAndLoginFlow() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("member@example.com", "password123", "테스트 사용자");
        LoginRequest loginRequest = new LoginRequest(registerRequest.email(), registerRequest.password());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(registerRequest.email()))
                .andExpect(jsonPath("$.displayName").value(registerRequest.displayName()));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(registerRequest.email()));
    }

    @Test
    @DisplayName("중복 이메일 가입 시 409 에러를 반환한다")
    void duplicateEmailFails() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("dup@example.com", "password123", "중복 사용자");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("잘못된 비밀번호로 로그인 시 401을 반환한다")
    void loginFailsWithWrongPassword() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("wrongpass@example.com", "password123", "샘플 사용자");
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        LoginRequest badLoginRequest = new LoginRequest(registerRequest.email(), "badpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badLoginRequest)))
                .andExpect(status().isUnauthorized());
    }
}
