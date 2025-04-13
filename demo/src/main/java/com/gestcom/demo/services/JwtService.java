package com.gestcom.demo.services;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secretKey;

    public SecretKey getSigningKey() {
        byte[] decodedKey = Base64.getDecoder().decode(secretKey);
        return Keys.hmacShaKeyFor(decodedKey);
    }
    @Value("${jwt.expiration}")
    private long jwtExpirationInMs;

    /**
     * Générer un token JWT
     * @param username Le nom d'utilisateur pour lequel générer le token
     * @return Le token JWT
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    /**
     * Extraire le nom d'utilisateur (subject) du token JWT
     * @param token Le token JWT
     * @return Le nom d'utilisateur
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Vérifie si le token est valide
     * @param token Le token JWT
     * @param username Le nom d'utilisateur
     * @return true si le token est valide, false sinon
     */
    public boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    /**
     * Vérifie si le token a expiré
     * @param token Le token JWT
     * @return true si le token a expiré, false sinon
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extraire la date d'expiration du token JWT
     * @param token Le token JWT
     * @return La date d'expiration
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extraire une revendication spécifique du token JWT
     * @param token Le token JWT
     * @param claimsResolver La fonction qui résout la revendication
     * @param <T> Le type de la revendication
     * @return La valeur de la revendication
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extraire toutes les revendications du token JWT
     * @param token Le token JWT
     * @return Les revendications
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .setAllowedClockSkewSeconds(2) // Autorise un décalage de 2 secondes
                .parseClaimsJws(token)
                .getBody();
    }
}
