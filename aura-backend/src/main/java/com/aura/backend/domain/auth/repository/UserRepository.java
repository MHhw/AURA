package com.aura.backend.domain.auth.repository;

import com.aura.backend.domain.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 사용자 이메일 찾음 (중복 가입인지 체크용)
    Optional<User> findByEmail(String email);

    // 사용자 닉네임 찾음 (중복 가입인지 체크용)
    Optional<User> findByName(String name);
}
