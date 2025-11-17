package com.aura.aura_connect.security.jwt;

import com.aura.aura_connect.security.jwt.config.JwtProperties;
import com.aura.aura_connect.user.domain.SocialType;
import com.aura.aura_connect.user.domain.UserPrincipal;
import static io.jsonwebtoken.Jwts.SIG;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class TokenProvider {

    private static final String EMAIL_CLAIM = "email";
    private static final String NAME_CLAIM = "name";
    private static final String PROFILE_IMAGE_CLAIM = "profileImageUrl";
    private static final String SOCIAL_TYPE_CLAIM = "socialType";

    private final JwtProperties jwtProperties;
    private final SecretKey secretKey;

    public TokenProvider(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.secretKey = Keys.hmacShaKeyFor(jwtProperties.secret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(UserPrincipal principal) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(jwtProperties.accessTokenValiditySeconds());

        SocialType socialType = principal.getSocialType() != null ? principal.getSocialType() : SocialType.UNKNOWN;

        return Jwts.builder()
                .subject(String.valueOf(principal.getId()))
                .claim(EMAIL_CLAIM, principal.getEmail())
                .claim(NAME_CLAIM, principal.getName())
                .claim(PROFILE_IMAGE_CLAIM, principal.getProfileImageUrl())
                .claim(SOCIAL_TYPE_CLAIM, socialType.name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(secretKey, SIG.HS256)
                .compact();
    }

    public String generateRefreshToken(Long userId) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(jwtProperties.refreshTokenValiditySeconds());

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(secretKey, SIG.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (RuntimeException ex) {
            return false;
        }
    }

    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token).getPayload();

        String socialTypeValue = claims.get(SOCIAL_TYPE_CLAIM, String.class);
        SocialType socialType = toSocialType(socialTypeValue);

        UserPrincipal principal = UserPrincipal.builder()
                .id(Long.parseLong(claims.getSubject()))
                .email(claims.get(EMAIL_CLAIM, String.class))
                .name(claims.get(NAME_CLAIM, String.class))
                .profileImageUrl(claims.get(PROFILE_IMAGE_CLAIM, String.class))
                .socialType(socialType)
                .build();

        return new UsernamePasswordAuthenticationToken(principal, token, principal.getAuthorities());
    }

    public Long getUserId(String token) {
        Claims claims = parseClaims(token).getPayload();
        return Long.parseLong(claims.getSubject());
    }

    private Jws<Claims> parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token);
    }

    private SocialType toSocialType(String socialTypeValue) {
        if (socialTypeValue == null) {
            return SocialType.UNKNOWN;
        }

        try {
            return SocialType.valueOf(socialTypeValue);
        } catch (IllegalArgumentException ex) {
            return SocialType.UNKNOWN;
        }
    }
}
