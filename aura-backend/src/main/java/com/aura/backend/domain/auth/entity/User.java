package com.aura.backend.domain.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 함부로 객체를 만들지 못하게 보호
@AllArgsConstructor
@Builder
public class User {

    @Id // Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 번호 자동으로 증가(1, 2, 3...)
    private Long id;

    @Column(nullable = false, unique = true) // 이메일, 비면 안되고 중복도 안됨
    private String email;

    @Column(nullable = false) // 비밀번호, 비면 안됨
    private String password;

    @Column(nullable = false, unique = true) // 닉네임, 비면 안됨
    private String name;

    @Column(nullable = false, updatable = false) // 비면 안되고 가입시간은 처음만
    private LocalDateTime createAt;
    
    // 객체가 처음 만들어질 때 자동으로 시간을 넣어줌
    @PrePersist
    protected void onCreate() {
        this.createAt = LocalDateTime.now();
    }

}
