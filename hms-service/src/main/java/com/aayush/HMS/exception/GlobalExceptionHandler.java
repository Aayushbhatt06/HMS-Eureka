package com.aayush.HMS.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("message", ex.getMessage());
        
        HttpStatus status = HttpStatus.BAD_REQUEST;
        String message = ex.getMessage() != null ? ex.getMessage().toLowerCase() : "";
        if (message.contains("not found")) {
            status = HttpStatus.NOT_FOUND;
        }
        
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        
        return new ResponseEntity<>(body, status);
    }
}
