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
        ReflectionTestUtils.setField(jwtService, "secretKey", "mySuperSecretKey12345");
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
        // Créer un token avec une date d'expiration courte
        ReflectionTestUtils.setField(jwtService, "jwtExpirationInMs", 1L);  // 1 milliseconde
        String token = jwtService.generateToken("testUser");

        try {
            Thread.sleep(10);  // Attendre un peu pour que le token expire
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        boolean isExpired = jwtService.validateToken(token, "testUser");
        assertFalse(isExpired, "The token should be expired");
    }

    @Test
    void testExtractExpiration() {
        String token = jwtService.generateToken("testUser");
        Date expirationDate = jwtService.extractExpiration(token);

        assertNotNull(expirationDate, "Expiration date should not be null");
        System.out.println("Token Expiration Date: " + expirationDate);
    }
}
