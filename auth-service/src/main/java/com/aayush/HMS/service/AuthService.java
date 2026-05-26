package com.aayush.HMS.service;

import com.aayush.HMS.dto.request.LoginRequest;
import com.aayush.HMS.dto.request.RegisterRequest;
import com.aayush.HMS.dto.response.JwtResponse;

public interface AuthService {
    String register(RegisterRequest request);
    JwtResponse login(LoginRequest request);
}
