package com.project.marketplaceplatform.controller.Auth;

import com.project.marketplaceplatform.config.Security.JwtUtil;
import com.project.marketplaceplatform.dto.AuthCredentialsRequest;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/")
//@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthCredentialsRequest request) {
        try {
            Authentication authenticate = authenticationManager
                    .authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getEmail(), request.getPassword()
                            )
                    );
            User user = (User) authenticate.getPrincipal();

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.AUTHORIZATION,
                            jwtUtil.generateToken(user)
                    )
                    .body(user);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User requestUser) {
        return userService.save(requestUser);
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateJWT(@RequestParam(name = "token") String token, @AuthenticationPrincipal User user) {
        try {
            Boolean validToken = jwtUtil.validateToken(token, user);
            System.out.println(validToken);
            return ResponseEntity.ok(validToken);
        } catch (ExpiredJwtException e) {
            System.out.println(" Token expired ");
            return ResponseEntity.status(401).body(false);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> test(@RequestParam String token, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok("test done");
    }
}
