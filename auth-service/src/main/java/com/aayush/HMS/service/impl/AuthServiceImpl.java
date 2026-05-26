package com.aayush.HMS.service.impl;

import com.aayush.HMS.dto.request.LoginRequest;
import com.aayush.HMS.dto.request.RegisterRequest;
import com.aayush.HMS.dto.response.JwtResponse;
import com.aayush.HMS.model.User;
import com.aayush.HMS.repository.UserRepository;
import com.aayush.HMS.service.AuthService;
import com.aayush.HMS.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public String register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists!");
        }

        User user;
        if (request.getRole() == null) {
            user = new User();
        } else {
            switch (request.getRole()) {
                case PATIENT:
                    user = new com.aayush.HMS.model.Patient();
                    break;
                case DOCTOR:
                    user = new com.aayush.HMS.model.Doctor();
                    break;
                case NURSE:
                    user = new com.aayush.HMS.model.Nurse();
                    break;
                case RECEPTIONIST:
                    user = new com.aayush.HMS.model.Receptionist();
                    break;
                default:
                    user = new User();
                    break;
            }
        }

        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        userRepository.save(user);

        return "User registered successfully!";
    }

    @Override
    public JwtResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.getUsername()));

        String token = jwtUtil.generateToken(request.getUsername());
        return new JwtResponse(
                token,
                user.getUsername(),
                user.getRole() != null ? user.getRole().name() : null,
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone()
        );
    }
}
