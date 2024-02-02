package com.project.marketplaceplatform.config.Security;

import com.project.marketplaceplatform.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        // Get authorization header and validate
        final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        String jwtFromParams = request.getParameter("token");
        if ((!StringUtils.hasText(header) && jwtFromParams == null) || (StringUtils.hasText(header) && !header.startsWith("Bearer "))) {
            filterChain.doFilter(request, response);
            return;
        }

        // Get jwt token and validate

        String token = null;

        if (jwtFromParams != null) {
            token = jwtFromParams;
        } else {
            // Authorization -> ([Bearer], (asdf.dsadasfas.sadaas.sadsa))
            token = header.split(" ")[1].trim();
        }

        String username = jwtUtil.getUsernameFromToken(token);

        UserDetails userDetails = userRepository
                .findByEmail(username)
                .orElse(null);


        if (!jwtUtil.validateToken(token, userDetails)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Get user identity and set it on the spring security context
        UsernamePasswordAuthenticationToken
                authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null,
                userDetails == null ?
                        List.of() : userDetails.getAuthorities()
        );

        authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request, response);
    }
}