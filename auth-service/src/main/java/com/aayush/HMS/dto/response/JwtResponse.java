package com.aayush.HMS.dto.response;






public class JwtResponse {
    private String token;
    private String username;
    private String role;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;

    public JwtResponse() {}

    public JwtResponse(String token) {
        this.token = token;
    }

    public JwtResponse(String token, String username, String role, String firstName, String lastName, String email, String phone) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
