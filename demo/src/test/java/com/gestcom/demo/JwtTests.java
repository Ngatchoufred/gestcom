package com.gestcom.demo;
import com.gestcom.demo.services.JwtService;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
public class JwtTests {
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        // Injecter les valeurs des propriétés `secretKey` et `jwtExpirationInMs`
        ReflectionTestUtils.setField(jwtService, "secretKey", "JjZn8Xn3L9JfYv3tPbX7JbFz7qM8RrWn4pVz2QyT6fYxHkNpLtZn8Xn3L9JfYv3tPbX7JbFz7qM8RrWn4pVz2QyT6fYxHkNpLt");
        ReflectionTestUtils.setField(jwtService, "jwtExpirationInMs", 3600000L);  // 1 heure
    }

    @Test
    void testGenerateToken() {
        String username = "testUser";
        String token = jwtService.generateToken(username);

        assertNotNull(token);
        System.out.println("Generated Token: " + token);

        String extractedUsername = jwtService.extractUsername(token);
        assertEquals(username, extractedUsername, "Username extracted from token should match the original username");
    }

    @Test
    void testValidateToken_ValidToken() {
        String username = "validUser";
        String token = jwtService.generateToken(username);

        boolean isValid = jwtService.validateToken(token, username);
        assertTrue(isValid, "The token should be valid for the given username");
    }

    @Test
    void testValidateToken_InvalidUsername() {
        String username = "validUser";
        String token = jwtService.generateToken(username);

        boolean isValid = jwtService.validateToken(token, "invalidUser");
        assertFalse(isValid, "The token should be invalid for a different username");
    }

    @Test
    void testIsTokenExpired() {
        // Fixer une expiration courte pour simuler un token expiré
        ReflectionTestUtils.setField(jwtService, "jwtExpirationInMs", 10); // 10 ms

        String token = jwtService.generateToken("testUser");

        // Attendre suffisamment pour que le token expire
        try {
            Thread.sleep(50); // 50 ms pour s'assurer que le token est expiré
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // Bonne pratique
        }

        boolean isValid = jwtService.validateToken(token, "testUser");

        assertFalse(isValid, "Le token devrait être expiré");
    }


    @Test
    void testExtractExpiration() {
        String token = jwtService.generateToken("testUser");
        Date expirationDate = jwtService.extractExpiration(token);

        assertNotNull(expirationDate, "Expiration date should not be null");
        System.out.println("Token Expiration Date: " + expirationDate);
    }
}
