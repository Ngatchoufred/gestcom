        package com.gestcom.demo.config;

        import com.gestcom.demo.filter.JwtAuthenticationFilter;
        import org.springframework.context.annotation.Bean;
        import org.springframework.context.annotation.Configuration;
        import org.springframework.security.authentication.AuthenticationManager;
        import org.springframework.security.config.Customizer;
        import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
        import org.springframework.security.config.annotation.web.builders.HttpSecurity;
        import org.springframework.security.config.http.SessionCreationPolicy;
        import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
        import org.springframework.security.crypto.password.PasswordEncoder;
        import org.springframework.security.web.SecurityFilterChain;
        import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
        @Configuration
        public class SecurityConfig {


            @Bean
            public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
                http
                        .csrf(csrf -> csrf.disable())  // Disable CSRF for APIs
                        .cors(Customizer.withDefaults())  //  Enable CORS support
                        .authorizeHttpRequests(auth -> auth
                                .requestMatchers("/auth/login", "/auth/register").permitAll()
                                .anyRequest().authenticated()
                        )
                        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
                return http.build();
            }

            @Bean
            public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
                    throws Exception {
                return authenticationConfiguration.getAuthenticationManager();
            }

            @Bean
            public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
            }
        }
