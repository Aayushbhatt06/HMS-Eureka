package com.aayush.HMS.service;

import com.aayush.HMS.dto.request.UserProfileUpdateRequest;
import com.aayush.HMS.model.User;

public interface UserService {
    User updateProfile(String username, UserProfileUpdateRequest request);
}
