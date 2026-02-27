package com.aura.backend.domain.auth.service;

import com.aura.backend.domain.auth.dto.AuthResponse;
import com.aura.backend.domain.auth.dto.RegisterRequest;
import com.aura.backend.domain.auth.entity.User;
import com.aura.backend.domain.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(RegisterRequest request){
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        if(userRepository.findByName(request.getName()).isPresent()){
            throw new RuntimeException("이미 사용 중인 닉네임입니다.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .name(request.getName())
                .build();

        userRepository.save(user);

        return AuthResponse.builder()
                .message("회원가입이 성공적으로 완료되었습니다.")
                .name(user.getName())
                .build();
    }

}
